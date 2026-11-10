<script setup>
import { reactive, ref, computed } from 'vue'
import { sizes, toppings, spiceLevels, priceOf, formatVND } from '../data/restaurants'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  item: { type: Object, required: true },
  highlight: Boolean
})
// Khởi tạo đối tượng cart để sử dụng các hàm của giỏ hàng."
const cart = useCartStore()
const options = reactive({ size: 'S', spice: 0, toppings: [] })
const showNutrition = ref(false)
const justAdded = ref(false)

const isDrink = computed(() => props.item.tags?.includes('nước'))
const isRiceOrSoup = computed(() => 
  props.item.tags?.includes('cơm') || props.item.tags?.includes('canh')
)

const canChooseSpice = computed(() => !isDrink.value && !isRiceOrSoup.value)

const availableToppings = computed(() => {
  if (isDrink.value) return []
  if (isRiceOrSoup.value) {
    return toppings.filter(t => t.id !== 'pho-mai')
  }
  return toppings
})

// sanitizedOptions giúp làm sạch dữ liệu trước khi gửi sang giỏ
const sanitizedOptions = computed(() => {
  const allowedIds = new Set(availableToppings.value.map(t => t.id))
  return {
    size: options.size,
    spice: canChooseSpice.value ? options.spice : 0,
    toppings: options.toppings.filter(id => allowedIds.has(id))
  }
})

// tự động tính đơn giá theo thời gian thực
const unitPrice = computed(() => priceOf(props.item, sanitizedOptions.value))
// lấy số lượng tồn kho thực tế của món từ Pinia.
const stockLeft = computed(() => cart.stock[props.item.id])
const inStock = computed(() => stockLeft.value > 0)
const onSale = computed(() => props.item.salePrice !== null)
//gọi action add của giỏ hàng Pinia, sau đó bật thông báo 'Đã thêm' trong 1.2 giây. 
function addToCart() {
  if (cart.add(props.item, sanitizedOptions.value, unitPrice.value)) {
    justAdded.value = true
    setTimeout(() => (justAdded.value = false), 1200)
  } 
}
</script>

<template>
  <article
    class="mcard" :class="{ 'mcard--out': !inStock, 'mcard--hl': highlight }"
    @mouseover="showNutrition = true" @mouseleave="showNutrition = false"
  >
    <div class="mcard__image-wrap">
      <img class="mcard__image" :src="item.image" :alt="item.name" loading="lazy" />
      <span v-if="item.veg" class="mcard__image-label">Món chay</span>
    </div>
    <div class="mcard__head">
      <h3>{{ item.name }}</h3>
      <span v-if="onSale" class="tag tag--sale">Giảm giá</span>
    </div>
    <p class="muted">{{ item.desc }}</p>
    <p class="mcard__meta">
      <span v-if="showNutrition">{{ item.kcal }} kcal</span>
      <span v-else>Rê chuột để xem calo</span>
      <span v-if="item.spicy" class="tag">Cay</span>
      <span v-if="item.veg" class="tag tag--veg">Chay</span>
    </p>

    <template v-if="inStock">
      <div class="opts">
        <label v-for="s in sizes" :key="s.id" class="chip">
          <input type="radio" v-model="options.size" :value="s.id" /> {{ s.label }}
        </label>
      </div>

      <div v-if="canChooseSpice" class="opts">
        <label class="field">Độ cay
          <select v-model.number="options.spice">
            <option v-for="(l, i) in spiceLevels" :key="i" :value="i">{{ l }}</option>
          </select>
        </label>
      </div>

      <div v-if="availableToppings.length" class="opts">
        <label v-for="t in availableToppings" :key="t.id" class="chip">
          <input type="checkbox" v-model="options.toppings" :value="t.id" />
          {{ t.label }}<template v-if="t.price"> +{{ formatVND(t.price) }}</template>
        </label>
      </div>
    </template>

    <div class="mcard__foot">
      <div>
        <strong>{{ formatVND(unitPrice) }}</strong>
        <s v-if="onSale" class="muted"> {{ formatVND(item.price) }}</s>
        <p class="muted small">{{ inStock ? `Còn ${stockLeft} phần` : 'Hết hàng' }}</p>
      </div>
      // Nút Thêm vào giỏ có gắn thuộc tính disabled để tự động khóa lại khi món ăn hết hàng
      <button class="btn" :disabled="!inStock" @click="addToCart">
        {{ !inStock ? 'Hết hàng' : justAdded ? 'Đã thêm' : 'Thêm vào giỏ' }}
      </button>
    </div>
  </article>
</template>
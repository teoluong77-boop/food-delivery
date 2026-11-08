<script setup>
import { reactive, ref, computed } from 'vue'
import { sizes, toppings, spiceLevels, priceOf, formatVND } from '../data/restaurants'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  item: { type: Object, required: true },
  highlight: Boolean
})

const cart = useCartStore()
const options = reactive({ size: 'S', spice: 0, toppings: [] })
const showNutrition = ref(false)
const justAdded = ref(false)

// Phân loại nhóm món theo tags
const isDrink = computed(() => props.item.tags?.includes('nước'))
const isRiceOrSoup = computed(() => 
  props.item.tags?.includes('cơm') || props.item.tags?.includes('canh')
)

// Điều kiện hiển thị độ cay: không hiện cho nước, cơm và canh
const canChooseSpice = computed(() => !isDrink.value && !isRiceOrSoup.value)

// Lọc danh sách topping hiển thị cho từng món:
// - Món nước: không có topping
// - Cơm & canh: chỉ chọn Trứng hoặc Thêm rau, bỏ Phô mai
// - Món khác (bún, mì, ăn vặt...): giữ nguyên danh sách topping
const availableToppings = computed(() => {
  if (isDrink.value) return []
  if (isRiceOrSoup.value) {
    return toppings.filter(t => t.id !== 'pho-mai')
  }
  return toppings
})

// Chuẩn hóa tùy chọn hợp lệ để tính giá và gửi vào giỏ
const sanitizedOptions = computed(() => {
  const allowedIds = new Set(availableToppings.value.map(t => t.id))
  return {
    size: options.size,
    spice: canChooseSpice.value ? options.spice : 0,
    toppings: options.toppings.filter(id => allowedIds.has(id))
  }
})

// Các giá trị suy ra từ state: tự cập nhật khi người dùng đổi tùy chọn / tồn kho đổi
const unitPrice = computed(() => priceOf(props.item, sanitizedOptions.value))
const stockLeft = computed(() => cart.stock[props.item.id])
const inStock = computed(() => stockLeft.value > 0)
const onSale = computed(() => props.item.salePrice !== null)

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
      <!-- Chọn size: Áp dụng cho tất cả món -->
      <div class="opts">
        <label v-for="s in sizes" :key="s.id" class="chip">
          <input type="radio" v-model="options.size" :value="s.id" /> {{ s.label }}
        </label>
      </div>

      <!-- Chọn độ cay: Tự động ẩn với Cơm, Canh và Nước -->
      <div v-if="canChooseSpice" class="opts">
        <label class="field">Độ cay
          <select v-model.number="options.spice">
            <option v-for="(l, i) in spiceLevels" :key="i" :value="i">{{ l }}</option>
          </select>
        </label>
      </div>

      <!-- Chọn topping: Ẩn Phô mai đối với Cơm/Canh, ẩn toàn bộ với Nước -->
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
      <button class="btn" :disabled="!inStock" @click="addToCart">
        {{ !inStock ? 'Hết hàng' : justAdded ? 'Đã thêm' : 'Thêm vào giỏ' }}
      </button>
    </div>
  </article>
</template>
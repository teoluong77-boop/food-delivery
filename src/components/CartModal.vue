<script setup>
import { reactive, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { spiceLevels, toppings, formatVND } from '../data/restaurants'

const cart = useCartStore()
const router = useRouter()
const showCheckout = ref(false)
const customer = reactive({ name: '', phone: '', address: '', note: '' })

const describe = o => {
  if (!o) return ''
  const parts = []
  if (o.size) parts.push(`Size ${o.size}`)
  if (o.spice && spiceLevels[o.spice]) parts.push(spiceLevels[o.spice])
  if (Array.isArray(o.toppings) && o.toppings.length) {
    const toppingNames = o.toppings
      .map(id => toppings.find(t => t.id === id)?.label)
      .filter(Boolean)
    if (toppingNames.length) parts.push(toppingNames.join(', '))
  }
  return parts.join(' • ')
}

function checkout() {
  if (cart.checkout(customer)) {
    Object.assign(customer, { name: '', phone: '', address: '', note: '' })
    showCheckout.value = false
    router.push({ name: 'orders' })
  }
}

function close() {
  cart.isOpen = false
  showCheckout.value = false
}
</script>

<template>
  <div v-if="cart.isOpen" class="overlay" @click.self="close">
    <aside class="drawer" role="dialog" aria-label="Giỏ hàng">
      <div class="drawer__head">
        <h2>{{ showCheckout ? 'Thông tin giao hàng' : 'Giỏ hàng' }}</h2>
        <button class="btn btn--ghost" @click="close">Đóng</button>
      </div>

      <p v-if="!cart.lines.length" class="muted empty">Giỏ hàng trống. Chọn một quán và thêm món đầu tiên.</p>

      <!-- Danh sách món trong giỏ -->
      <ul v-if="cart.lines.length && !showCheckout" class="lines">
        <li v-for="l in cart.lines" :key="l.key">
          <div>
            <strong>{{ l.name }}</strong>
            <p v-if="describe(l.options)" class="muted small">{{ describe(l.options) }}</p>
            <p class="small font-weight-bold">
              {{ formatVND(l.unitPrice * l.qty) }}
              <span class="muted" v-if="l.qty > 1">({{ formatVND(l.unitPrice) }} x {{ l.qty }})</span>
            </p>
          </div>
          <div class="qty">
            <button class="btn btn--ghost" @click="cart.changeQty(l.key, -1)" aria-label="Giảm">-</button>
            <span>{{ l.qty }}</span>
            <button class="btn btn--ghost" :disabled="!cart.inStock(l.itemId)" @click="cart.changeQty(l.key, 1)" aria-label="Tăng">+</button>
            <button class="btn btn--ghost text-danger" @click="cart.remove(l.key)">Xóa</button>
          </div>
        </li>
      </ul>

      <!-- Tóm tắt chi phí -->
      <div v-if="cart.lines.length && !showCheckout" class="sum">
        <p><span>Tạm tính</span><span>{{ formatVND(cart.subtotal) }}</span></p>
        <p><span>Phí giao hàng</span><span>{{ formatVND(cart.deliveryFee) }}</span></p>
        <p class="sum__total"><span>Tổng cộng</span><strong>{{ formatVND(cart.total) }}</strong></p>
        <button class="btn btn--chili btn--block" @click="showCheckout = true">Nhập thông tin giao hàng</button>
      </div>

      <!-- Form Checkout COD -->
      <form v-if="cart.lines.length && showCheckout" class="checkout-form" @submit.prevent="checkout">
        <p class="checkout-form__intro">Cho Bếp Nhà biết nơi giao món cho bạn nhé.</p>
        <label class="checkout-field">Tên người nhận
          <input v-model.trim="customer.name" required minlength="2" autocomplete="name" placeholder="Nguyễn Văn An" />
        </label>
        <label class="checkout-field">Số điện thoại
          <input v-model.trim="customer.phone" required minlength="9" maxlength="15" pattern="[0-9+ .()-]{9,15}" autocomplete="tel" inputmode="tel" placeholder="0901 234 567" />
        </label>
        <label class="checkout-field">Địa chỉ giao hàng
          <textarea v-model.trim="customer.address" required minlength="8" autocomplete="street-address" rows="2" placeholder="Số nhà, đường, phường/xã, quận/huyện"></textarea>
        </label>
        <label class="checkout-field">Ghi chú cho quán <span class="muted">(không bắt buộc)</span>
          <textarea v-model.trim="customer.note" rows="2" placeholder="Ví dụ: ít cay, gọi khi đến nơi"></textarea>
        </label>
        <div class="checkout-payment"><span>Thanh toán</span><strong>Tiền mặt khi nhận hàng (COD)</strong></div>
        <p><span>Tổng thanh toán</span><strong>{{ formatVND(cart.total) }}</strong></p>
        <div class="checkout-actions">
          <button type="button" class="btn btn--ghost" @click="showCheckout = false">Quay lại giỏ</button>
          <button type="submit" class="btn btn--chili">Xác nhận đặt hàng</button>
        </div>
      </form>
    </aside>
  </div>
</template>
<script setup>
import { computed } from 'vue'
// Kết nối với cartStore để lấy số lượng món và điều khiển đóng mở giỏ hàng
import { useCartStore } from '../stores/cart'
// Kết nối với orderStore để quản lý số đơn hàng đang hoạt động
import { useOrderStore } from '../stores/orders'

// Tạo biến cart đại diện cho kho dữ liệu giỏ hàng
const cart = useCartStore()
// Tạo biến orders đại diện cho kho dữ liệu đơn hàng
const orders = useOrderStore()
// activeCount tự động tính tổng số đơn hàng đang được xử lý để gắn huy hiệu lên nút Đơn hàng
const activeCount = computed(() => orders.active.length)
</script>

<template>
  <header class="header">
    <div class="container header__row">
      <!-- Logo Bếp Nhà dùng router-link để chuyển về trang chủ mà không tải lại trang -->
      <router-link to="/" class="brand">Bếp Nhà</router-link>
      <nav class="nav">
        <router-link to="/">Quán ăn</router-link>
        <router-link to="/orders">
          Đơn hàng
          <!-- Nút Đơn hàng có huy hiệu tự động hiện số đơn đang giao qua v-if activeCount -->
          <span v-if="activeCount" class="badge badge--sesame">{{ activeCount }}</span>
        </router-link>
      </nav>

      <!-- Nút giỏ hàng bắt sự kiện click đổi cờ cart.isOpen sang true để mở Drawer giỏ hàng trượt ra -->
      <button class="btn btn--chili" @click="cart.isOpen = true" aria-label="Mở giỏ hàng">
        Giỏ hàng
        <!-- Thẻ span badge này lấy từ Getter cart.count trong Pinia, tự động nhảy số theo thời gian thực mỗi khi thêm/bớt món -->
        <span class="badge">{{ cart.count }}</span>
      </button>
    </div>
  </header>
</template>
<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useOrderStore } from '../stores/orders'

const cart = useCartStore()
const orders = useOrderStore()
const activeCount = computed(() => orders.active.length)
</script>

<template>
  <header class="header">
    <div class="container header__row">
      <router-link to="/" class="brand">Bếp Nhà</router-link>
      <nav class="nav">
        <router-link to="/">Quán ăn</router-link>
        <router-link to="/orders">
          Đơn hàng
          <span v-if="activeCount" class="badge badge--sesame">{{ activeCount }}</span>
        </router-link>
      </nav>
      <button class="btn btn--chili" @click="cart.isOpen = true" aria-label="Mở giỏ hàng">
        Giỏ hàng
        <span class="badge">{{ cart.count }}</span>
      </button>
    </div>
  </header>
</template>

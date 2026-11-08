<script setup>
import { computed } from 'vue'
import { restaurantById } from '../data/restaurants'

// Tham số động :id được truyền vào dưới dạng prop (props: true trong router)
const props = defineProps({ id: String })
const restaurant = computed(() => restaurantById(props.id))
</script>

<template>
  <template v-if="restaurant">
    <div class="rhead" :style="{ background: restaurant.color }">
      <h1>{{ restaurant.name }}</h1>
      <p>{{ restaurant.eta }} phút · {{ restaurant.rating }} sao</p>
    </div>
    <nav class="tabs">
      <router-link :to="{ name: 'menu', params: { id } }">Thực đơn</router-link>
      <router-link :to="{ name: 'info', params: { id } }">Thông tin quán</router-link>
    </nav>
    <router-view />
  </template>
  <div v-else class="empty">
    <p>Không tìm thấy quán này.</p>
    <router-link to="/">Về trang chủ</router-link>
  </div>
</template>

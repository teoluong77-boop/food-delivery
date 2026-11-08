<script setup>
defineProps({ restaurant: { type: Object, required: true } })
</script>

<template>
  <router-link :to="{ name: 'menu', params: { id: restaurant.id } }" class="rcard">
    <div class="rcard__cover" :style="{ background: restaurant.color }">
      <img class="rcard__image" :src="`/images/restaurants/${restaurant.id}.jpg`" :alt="restaurant.name" loading="lazy" />
      <span class="rcard__open">Đang mở cửa</span>
    </div>
    <div class="rcard__body">
      <h3>{{ restaurant.name }}</h3>
      <p class="muted">Món ngon mỗi ngày</p>
      <div class="rcard__meta"><span>★ {{ restaurant.rating }}</span><span>·</span><span>⏱ {{ restaurant.eta }} phút</span></div>
    </div>
  </router-link>
</template>

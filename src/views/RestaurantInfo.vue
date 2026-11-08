<script setup>
import { computed } from 'vue'
import { restaurantById } from '../data/restaurants'

const props = defineProps({ id: String })
const r = computed(() => restaurantById(props.id))
</script>

<template>
  <dl class="info" v-if="r">
    <dt>Địa chỉ</dt><dd>{{ r.address }}</dd>
    <dt>Giờ mở cửa</dt><dd>{{ r.hours }}</dd>
    <dt>Thời gian giao ước tính</dt><dd>{{ r.eta }} phút</dd>
  </dl>
</template>

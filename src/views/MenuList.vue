<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { menuItems } from '../data/restaurants'
import MenuItemCard from '../components/MenuItemCard.vue'

const props = defineProps({ id: String })
const route = useRoute()
const items = computed(() => menuItems.filter(i => i.restaurantId === props.id))
</script>

<template>
  <div class="grid grid--menu">
    <MenuItemCard v-for="it in items" :key="it.id" :item="it" :highlight="route.query.item === it.id" />
  </div>
</template>

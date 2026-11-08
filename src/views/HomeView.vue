<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories, restaurants } from '../data/restaurants'
import { useChatStore } from '../stores/chat'
import RestaurantCard from '../components/RestaurantCard.vue'

const route = useRoute()
const router = useRouter()
const chat = useChatStore()
const query = ref('')

// Danh mục lưu trên URL (?cat=com) để chia sẻ/bookmark được
const current = computed(() => route.query.cat || 'all')
const filtered = computed(() =>
  current.value === 'all' ? restaurants : restaurants.filter(r => r.category === current.value)
)
const setCat = id => router.push({ name: 'home', query: id === 'all' ? {} : { cat: id } })

function search() {
  chat.ask(query.value)
  query.value = ''
}
</script>

<template>
  <section class="hero">
    <div class="hero__content">
      <span class="hero__eyebrow">BẾP NHÀ · NGON NHƯ CƠM NHÀ</span>
      <h1>Hôm nay bạn muốn<br class="desktop-break" /> ăn gì?</h1>
      <p class="hero__copy">Chọn món bạn yêu thích, bếp chuẩn bị thật ngon và giao đến tận nơi.</p>
    <form class="search" @submit.prevent="search">
      <input v-model="query" placeholder="Bạn đang thèm món gì nhỉ?" />
      <button class="btn btn--chili">Khám phá món ngon <span aria-hidden="true">→</span></button>
    </form>
    </div>
    <div class="hero__art" aria-hidden="true"><span>🍜</span><i>🥢</i></div>
  </section>

  <div class="section-heading">
    <div><span class="section-heading__eyebrow">CHỌN THEO KHẨU VỊ</span><h2>Hôm nay ăn gì?</h2></div>
    <p>Những quán được yêu thích gần bạn</p>
  </div>
  <div class="cats">
    <button v-for="c in categories" :key="c.id" class="chip chip--btn" :class="{ 'chip--on': current === c.id }" @click="setCat(c.id)">
      {{ c.label }}
    </button>
  </div>

  <div v-if="filtered.length" class="grid">
    <RestaurantCard v-for="r in filtered" :key="r.id" :restaurant="r" />
  </div>
  <p v-else class="muted empty">Chưa có quán nào trong danh mục này.</p>
</template>

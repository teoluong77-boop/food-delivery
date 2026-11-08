<script setup>
import AppHeader from './components/AppHeader.vue'
import CartModal from './components/CartModal.vue'
import AIChatbot from './components/AIChatbot.vue'
</script>

<template>
  <AppHeader />
  <main class="container">
    <router-view />
  </main>
  <CartModal />
  <AIChatbot />
</template>

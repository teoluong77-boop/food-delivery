<script setup>
import { ref, watch, nextTick } from 'vue'
import { useChatStore } from '../stores/chat'
import { formatVND, priceOf } from '../data/restaurants'
import { useCartStore } from '../stores/cart'

const chat = useChatStore()
const cart = useCartStore()
const input = ref('')
const body = ref(null)
const addedItems = ref([])

function send() {
  chat.ask(input.value)
  input.value = ''
}

function addSuggestion(item) {
  const options = { size: 'S', spice: 0, toppings: [] }
  if (cart.add(item, options, priceOf(item, options))) addedItems.value.push(item.id)
}

// Tự cuộn xuống tin nhắn mới nhất
watch(() => chat.messages.length, async () => {
  await nextTick()
  body.value?.scrollTo({ top: body.value.scrollHeight })
})
</script>

<template>
  <button v-if="!chat.isOpen" class="fab" @click="chat.isOpen = true">Hỏi trợ lý</button>

  <section v-else class="chat" aria-label="Trợ lý gợi ý món">
    <div class="chat__head">
      <strong>Trợ lý gợi ý món</strong>
      <button class="btn btn--ghost" @click="chat.isOpen = false">Thu nhỏ</button>
    </div>

    <div ref="body" class="chat__body">
      <div v-for="(m, i) in chat.messages" :key="i" class="msg" :class="`msg--${m.role}`">
        <p>{{ m.text }}</p>
        <article v-for="it in m.items" :key="it.id" class="sugg">
          <router-link class="sugg__link" :to="{ name: 'menu', params: { id: it.restaurantId }, query: { item: it.id } }" @click="chat.isOpen = false">
            <img :src="it.image" :alt="it.name" loading="lazy" />
            <span class="sugg__details">
              <strong>{{ it.name }}</strong>
              <span class="muted small">{{ it.reason }}</span>
              <span class="muted small">{{ it.kcal }} kcal · {{ formatVND(it.salePrice ?? it.price) }}</span>
            </span>
          </router-link>
          <button class="btn sugg__add" :disabled="cart.stock[it.id] <= 0" @click="addSuggestion(it)">
            {{ cart.stock[it.id] <= 0 ? 'Hết hàng' : addedItems.includes(it.id) ? 'Đã thêm vào giỏ' : 'Thêm nhanh' }}
          </button>
        </article>
      </div>
      <p v-if="chat.loading" class="muted small">Đang tìm món...</p>
    </div>

    <form class="chat__form" @submit.prevent="send">
      <input v-model="input" placeholder="Ví dụ: đồ chay không cay dưới 50k" />
      <button class="btn" :disabled="chat.loading">Gửi</button>
    </form>
  </section>
</template>

import { defineStore } from 'pinia'
import { suggest } from '../services/ai'

export const useChatStore = defineStore('chat', {
  state: () => ({
    isOpen: false,
    loading: false,
    messages: [{ role: 'bot', text: 'Xin chào! Bạn muốn ăn gì hôm nay? Thử: "món nhẹ dưới 400 kcal" hoặc "đồ cay dưới 60k".', items: [] }]
  }),
  actions: {
    async ask(text) {
      const q = text.trim()
      if (!q || this.loading) return
      this.isOpen = true
      this.messages.push({ role: 'user', text: q, items: [] })
      this.loading = true
      try {
        const { items, reply } = await suggest(q)
        this.messages.push({ role: 'bot', text: reply, items })
      } catch {
        this.messages.push({ role: 'bot', text: 'Không kết nối được trợ lý. Bạn thử lại sau nhé.', items: [] })
      } finally {
        this.loading = false
      }
    }
  }
})

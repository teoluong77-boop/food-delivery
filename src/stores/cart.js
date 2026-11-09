import { defineStore } from 'pinia'
import { menuItems } from '../data/restaurants'
import { useOrderStore } from './orders'

const DELIVERY_FEE = 15000

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: [],
    isOpen: false,
    stock: Object.fromEntries(menuItems.map(i => [i.id, i.stock ?? 99]))
  }),
  getters: {
    count: s => s.lines.reduce((n, l) => n + l.qty, 0),
    subtotal: s => s.lines.reduce((t, l) => t + l.unitPrice * l.qty, 0),
    deliveryFee: s => (s.lines.length ? DELIVERY_FEE : 0),
    total() { return this.subtotal + this.deliveryFee },
    inStock: s => id => (s.stock[id] ?? 0) > 0
  },
  actions: {
    add(item, options = {}, unitPrice) { 
      // kiểm tra tồn kho
      if ((this.stock[item.id] ?? 0) <= 0) return false

      const toppings = options.toppings || []
      const key = [
        item.id,
        options.size || '',
        options.spice || '',
        [...toppings].sort().join('+')
      ].join('|')

      const line = this.lines.find(l => l.key === key)
      if (line) {
        line.qty++
      } else {
        this.lines.push({
          key,
          itemId: item.id,
          name: item.name,
          unitPrice,
          qty: 1,
          options: { ...options, toppings: [...toppings] }
        })
      }
      this.stock[item.id]--
      return true
    },
    changeQty(key, delta) {
      const line = this.lines.find(l => l.key === key)
      if (!line) return
      if (delta > 0 && (this.stock[line.itemId] ?? 0) < delta) return

      line.qty += delta
      this.stock[line.itemId] -= delta

      if (line.qty <= 0) {
        this.lines = this.lines.filter(l => l.key !== key)
      }
    },
    remove(key) {
      const line = this.lines.find(l => l.key === key)
      if (!line) return
      this.stock[line.itemId] += line.qty
      this.lines = this.lines.filter(l => l.key !== key)
    },
    checkout(customer) {
      if (!this.lines.length) return null
      const order = useOrderStore().place(this.lines, this.total, customer)
      this.lines = []
      this.isOpen = false
      return order
    }
  }
})
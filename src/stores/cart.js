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
// Getter count tính tổng số lượng món để hiển thị huy hiệu trên Header, tự động nhảy số theo thời gian thực
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
      // thuật toán Composite Key
      // thành mã duy nhất để phân biệt các tùy chọn khác nhau của cùng một món ăn
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
      //trừ bớt 1 món trong kho hàng ngay sau khi thêm vào giỏ thành công
      this.stock[item.id]--
      //thông báo thành công cho người dùng
      return true
    },
// Cơ chế bù trừ tồn kho: khách bấm tăng thì kho trừ, khách bấm giảm thì kho được cộng trả lại tương ứng
    changeQty(key, delta) {
      const line = this.lines.find(l => l.key === key)
      if (!line) return
      if (delta > 0 && (this.stock[line.itemId] ?? 0) < delta) return

      line.qty += delta
      this.stock[line.itemId] -= delta
// Nếu khách bấm giảm số lượng về 0 thì tự động xóa món đó ra khỏi giỏ hàng
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
//Bắt đầu thanh toán, nếu giỏ rỗng thì chặn lại
    checkout(customer) {
      if (!this.lines.length) return null
      // Gửi thông tin giỏ hàng và khách hàng sang orderStore để tạo đơn hàng mới
      const order = useOrderStore().place(this.lines, this.total, customer)
      // Dọn sạch giỏ hàng về rỗng
      this.lines = []
// Đóng giao diện giỏ hàng và chuyển khách sang trang theo dõi đơn hàng
      this.isOpen = false
      return order
    }
  }
})
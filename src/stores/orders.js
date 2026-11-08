import { defineStore } from 'pinia'

export const STATUS = {
  preparing: 'Đang chuẩn bị',
  delivering: 'Đang giao',
  delivered: 'Đã giao'
}
const NEXT = { preparing: 'delivering', delivering: 'delivered' }
const timers = new Map()

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem('bep-nha-orders') || '[]')
  } catch {
    return []
  }
}

function saveOrders(list) {
  try {
    localStorage.setItem('bep-nha-orders', JSON.stringify(list))
  } catch {
    // Đơn vẫn dùng được trong phiên hiện tại nếu trình duyệt chặn localStorage.
  }
}

export const useOrderStore = defineStore('orders', {
  state: () => ({ list: readOrders() }),
  getters: {
    active: s => s.list.filter(o => o.status !== 'delivered'),
    sorted: s => [...s.list].sort((a, b) => b.createdAt - a.createdAt)
  },
  actions: {
    place(lines, total, customer) {
      const createdAt = Date.now()
      const order = {
        id: `BN${String(createdAt).slice(-6)}`,
        lines: JSON.parse(JSON.stringify(lines)),
        customer: { ...customer },
        payment: 'Thanh toán khi nhận hàng (COD)',
        total, status: 'preparing', createdAt, updatedAt: createdAt,
        estimatedMinutes: 25
      }
      this.list.push(order)
      saveOrders(this.list)
      this.simulate(order.id)
      return order
    },
    resume() {
      this.active.forEach(order => this.simulate(order.id))
    },
    // Mô phỏng quán/shipper cập nhật trạng thái: 8 giây mỗi bước để tiện trình diễn.
    simulate(id, delay = 8000) {
      if (timers.has(id)) return
      const step = () => {
        timers.delete(id)
        const o = this.list.find(x => x.id === id)
        if (!o || !NEXT[o.status]) return
        o.status = NEXT[o.status]
        o.updatedAt = Date.now()
        saveOrders(this.list)
        if (NEXT[o.status]) timers.set(id, setTimeout(step, delay))
      }
      timers.set(id, setTimeout(step, delay))
    }
  }
})

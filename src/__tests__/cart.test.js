import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../stores/cart'
import { itemById, priceOf } from '../data/restaurants'
import { mockSuggest } from '../services/ai'

const opts = () => ({ size: 'S', spice: 0, toppings: [] })

describe('cart store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('thêm món làm giảm tồn kho và cộng dồn số lượng', () => {
    const cart = useCartStore(), it1 = itemById('ct-suon')
    const before = cart.stock[it1.id]
    cart.add(it1, opts(), priceOf(it1, opts()))
    cart.add(it1, opts(), priceOf(it1, opts()))
    expect(cart.lines).toHaveLength(1)
    expect(cart.count).toBe(2)
    expect(cart.stock[it1.id]).toBe(before - 2)
  })

  it('xóa món hoàn trả đúng tồn kho', () => {
    const cart = useCartStore(), it1 = itemById('xb-xien')
    const before = cart.stock[it1.id]
    cart.add(it1, opts(), 35000)
    cart.add(it1, opts(), 35000)
    cart.remove(cart.lines[0].key)
    expect(cart.stock[it1.id]).toBe(before)
    expect(cart.lines).toHaveLength(0)
  })

  it('không thêm được món hết hàng', () => {
    const cart = useCartStore()
    expect(cart.add(itemById('ct-bo'), opts(), 75000)).toBe(false)
  })

  it('tính tổng tiền gồm phí giao hàng', () => {
    const cart = useCartStore(), it1 = itemById('xb-bap')
    cart.add(it1, opts(), 25000)
    expect(cart.total).toBe(25000 + 15000)
  })
})

describe('AI mock', () => {
  it('lọc theo calo và không cay', () => {
    const { items } = mockSuggest('món nhẹ dưới 400 kcal không cay')
    expect(items.length).toBeGreaterThan(0)
    expect(items.every(i => i.kcal <= 400 && !i.spicy)).toBe(true)
  })
})

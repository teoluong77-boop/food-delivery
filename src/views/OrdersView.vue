<script setup>
import { onMounted } from 'vue'
import { useOrderStore, STATUS } from '../stores/orders'
import { formatVND } from '../data/restaurants'

const orders = useOrderStore()
const steps = Object.keys(STATUS)
const reached = (order, step) => steps.indexOf(step) <= steps.indexOf(order.status)
const formatTime = value => new Date(value).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })

onMounted(() => orders.resume())
</script>

<template>
  <h1>Đơn hàng của bạn</h1>
  <p v-if="!orders.sorted.length" class="muted empty">Bạn chưa có đơn nào. Đặt món để theo dõi trạng thái tại đây.</p>

  <article v-for="o in orders.sorted" :key="o.id" class="order">
    <div class="order__head">
      <div><strong>Đơn {{ o.id }}</strong><p class="muted small">Đặt lúc {{ formatTime(o.createdAt) }}</p></div>
      <span class="order__status">{{ STATUS[o.status] }}</span>
    </div>
    <ul class="steps">
      <li v-for="s in steps" :key="s" :class="{ 'steps--on': reached(o, s) }">{{ STATUS[s] }}</li>
    </ul>
    <div class="order__details">
      <p><strong>Món đã đặt</strong></p>
      <ul class="order__items"><li v-for="line in o.lines" :key="line.key">{{ line.qty }} × {{ line.name }} <span>{{ formatVND(line.unitPrice * line.qty) }}</span></li></ul>
      <p><strong>Người nhận:</strong> {{ o.customer?.name }} · {{ o.customer?.phone }}</p>
      <p><strong>Giao đến:</strong> {{ o.customer?.address }}</p>
      <p v-if="o.customer?.note"><strong>Ghi chú:</strong> {{ o.customer.note }}</p>
      <p><strong>Thanh toán:</strong> {{ o.payment || 'Tiền mặt khi nhận hàng (COD)' }}</p>
      <div class="order__total"><span>Tổng cộng</span><strong>{{ formatVND(o.total) }}</strong></div>
      <p class="order__eta" v-if="o.status !== 'delivered'">Dự kiến giao trong khoảng {{ o.estimatedMinutes || 25 }} phút · Trạng thái tự cập nhật để mô phỏng quy trình.</p>
    </div>
  </article>
</template>

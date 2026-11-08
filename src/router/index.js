import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RestaurantView from '../views/RestaurantView.vue'
import MenuList from '../views/MenuList.vue'
import RestaurantInfo from '../views/RestaurantInfo.vue'
import OrdersView from '../views/OrdersView.vue'

// Hash history để chạy được trên GitHub Pages mà không cần cấu hình rewrite
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      // Route cha + route con, :id là dynamic segment
      path: '/restaurant/:id',
      component: RestaurantView,
      props: true,
      children: [
        { path: '', name: 'menu', component: MenuList, props: true },
        { path: 'info', name: 'info', component: RestaurantInfo, props: true }
      ]
    },
    { path: '/orders', name: 'orders', component: OrdersView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

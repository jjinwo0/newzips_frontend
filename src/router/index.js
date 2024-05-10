import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductList from '@/components/ProductList.vue'
import NoticeBoard from '@/components/NoticeBoard.vue'
import BoardDetail from '@/components/BoardDetail.vue'
import BoardUpdate from '@/components/BoardUpdate.vue'
import WriteBoard from '@/components/WriteBoard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'product-list',
      component: ProductList
    },
    {
      path: '/board',
      name: 'board-list',
      component: NoticeBoard
    },
    {
      path: '/board/write',
      name: 'write-board',
      component: WriteBoard
    },
    {
      path: '/board/:id',
      name: 'board-detail',
      component: BoardDetail
    },
    {
      path: '/board/update/:id',
      name: 'board-update',
      component: BoardUpdate
    }
  ]
})

export default router

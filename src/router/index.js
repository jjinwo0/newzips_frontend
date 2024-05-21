import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoticeBoard from '@/components/NoticeBoard.vue'
import BoardDetail from '@/components/BoardDetail.vue'
import BoardUpdate from '@/components/BoardUpdate.vue'
import WriteBoard from '@/components/WriteBoard.vue'
import OAuthRedirect from '@/components/oauth/OAuthRedirect.vue'
import ExpertList from '@/components/ExpertList.vue'
import ChatComponent from '@/components/common/ChatComponent.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import ChatGptComponent from '@/components/common/ChatGptComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/expert',
      name: 'expert-list',
      component: ExpertList
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
    },
    {
      path: '/oauth/success',
      name: 'oauth',
      component: OAuthRedirect
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatComponent
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard
    },
    {
      path: '/chat/bot',
      name: 'chatbot',
      component: ChatGptComponent
    }
  ]
})

export default router

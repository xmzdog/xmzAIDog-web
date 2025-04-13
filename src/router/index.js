import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 这里可以添加检查登录状态的逻辑
    // 例如检查session或token
    const isLoggedIn = true // 这里需要根据实际情况判断
    
    if (!isLoggedIn) {
      ElMessage.warning('请先登录')
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 
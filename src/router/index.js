import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userService } from '../services/user'

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
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }  // 明确标记登录页不需要认证
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }  // 明确标记注册页不需要认证
  },
  {
    path: '/userlogout',
    name: 'logout',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }  // 明确标记登出页不需要认证
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 如果目标页面不需要认证，直接放行
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  try {
    // 尝试获取用户信息，如果成功则表示已登录
    const res = await userService.getUserInfo()
    if (res && (res.code === 200 || res.code === 0)) {
      // 将用户信息添加到路由元信息中
      to.meta.userInfo = res.data
      next()
    } else {
      // 如果未登录，重定向到登录页，并保存当前要访问的路径
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 如果发生错误，也重定向到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})

export default router 
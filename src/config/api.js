// API基础URL
export const BASE_URL = '/xmz'  // 使用相对路径，通过代理转发

// 用户相关接口
export const API_ROUTES = {
  LOGIN: '/user/login',  // 确保这个路径与后端API一致
  REGISTER: '/user/register',
  LOGOUT: '/user/userlogout',
  GETLOGIN: '/user/getloginuser'
} 
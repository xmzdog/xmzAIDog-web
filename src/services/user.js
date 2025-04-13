import http from './http'
import { API_ROUTES } from '../config/api'

export const userService = {
  // 用户登录
  login(data) {
    // 直接发送请求体，不使用额外的封装
    return http.post(API_ROUTES.LOGIN, {
      useraccount: data.username,
      userpassword: data.password
    })
  },

  // 用户注册
  register(data) {
    return http.post(API_ROUTES.REGISTER, {
      useraccount: data.username,
      userpassword: data.password,
      checkPassword: data.confirmPassword
    })
  },

  // 用户登出
  logout() {
    return http.post(API_ROUTES.LOGOUT)
  },

  // 获取用户信息
  getUserInfo() {
    return http.get(API_ROUTES.GETLOGIN)
  },

  // 上传头像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post(API_ROUTES.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 更新用户信息
  updateUserInfo(data) {
    return http.post(API_ROUTES.UPDATE_USER, data)
  }
} 
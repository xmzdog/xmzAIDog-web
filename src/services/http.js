import axios from 'axios'
import { BASE_URL } from '../config/api'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建axios实例
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json'
  },
  withCredentials: true  // 允许发送cookie，这是session机制必需的
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 打印请求信息
    console.log('请求URL:', config.url)
    console.log('请求方法:', config.method)
    console.log('请求参数:', config.data)
    console.log('请求头:', config.headers)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    const res = response.data
    console.log('原始响应数据:', res)
    console.log('响应头:', response.headers)
    
    // 处理BaseResponse格式
    if (res.code === 200 || res.code === 0) {  // 有些后端可能使用0表示成功
      console.log('处理后的响应数据:', res.data)
      return res  // 返回完整的响应数据
    } else {
      // 如果是未登录错误，直接返回错误对象，让调用方处理
      if (res.code === 401) {
        return Promise.reject({ isAuthError: true, ...res })
      }
      // 其他错误直接返回，让调用方处理
      return Promise.reject(res)
    }
  },
  error => {
    console.error('请求错误:', error)
    if (error.response) {
      console.error('错误响应:', error.response.data)
      console.error('错误状态码:', error.response.status)
      console.error('错误响应头:', error.response.headers)
      
      // 处理BaseResponse格式的错误
      const errorData = error.response.data
      if (errorData && errorData.message) {
        // 如果是未登录错误，直接返回错误对象，让调用方处理
        if (error.response.status === 401) {
          return Promise.reject({ isAuthError: true, ...errorData })
        }
        return Promise.reject(errorData)
      } else {
        switch (error.response.status) {
          case 401:
            return Promise.reject({ isAuthError: true, message: '未授权，请重新登录' })
          case 403:
            return Promise.reject({ message: '拒绝访问' })
          case 404:
            return Promise.reject({ message: '请求错误，未找到该资源' })
          case 500:
            return Promise.reject({ message: '服务器错误' })
          default:
            return Promise.reject({ message: '网络错误' })
        }
      }
    } else {
      return Promise.reject({ message: '网络连接失败' })
    }
  }
)

export default http 
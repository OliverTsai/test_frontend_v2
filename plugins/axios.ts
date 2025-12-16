import axios from 'axios'

export default defineNuxtPlugin(() => {
  const baseURL = 'https://42683.wu.elitepro.ltd'
  
  const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  // 請求攔截器
  axiosInstance.interceptors.request.use(
    (config) => {
      // 可以在這裡添加認證令牌等
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  // 響應攔截器
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // 處理錯誤
      console.error('API Error:', error)
      return Promise.reject(error)
    }
  )
  
  return {
    provide: {
      axios: axiosInstance
    }
  }
})
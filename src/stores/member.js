import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'

const REST_MEMBER_API = `http://localhost:8080/member`

// 로그인 상태와 토큰을 저장하기 위한 ref 생성
const isLoggedIn = ref(false)
const token = ref('')

export const useMemberStore = defineStore('member', () => {

  // 로그인 함수
  const login = (username, password) => {
    axios.post(`${REST_MEMBER_API}/login`, { username, password })
    .then((res) => {
      // 응답으로부터 토큰 받기
      const receivedToken = res.data.accessToken 
      
      localStorage.setItem('token', receivedToken)
      token.value = receivedToken
      isLoggedIn.value = true
      
      router.push('/')
    })
    .catch((err) => {
      console.error("로그인 에러 발생 :: ", err);
    })
  }

  // 로그아웃 함수
  const logout = () => {

    axios.post(`${REST_MEMBER_API}/logout`)
    .then(() => {
      localStorage.removeItem('token')
      token.value = ''
      isLoggedIn.value = false
      router.push('/')
    })
    .error((err) => {
      console.error("로그아웃 에러 발생 :: ", err)
    })

  }

  // Axios 인터셉터 설정
  axios.interceptors.request.use((config) => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  return { login, logout, isLoggedIn, token }
})

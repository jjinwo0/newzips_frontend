import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ref } from 'vue'

const REST_MEMBER_API = `http://localhost:8080/member`

const loginMember = ref(null)

export const useMemberStore = defineStore('member', () => {

  // 로그인 함수
  const login = (username, password) => {
    axios.post(`${REST_MEMBER_API}/login`, { username, password })
    .then((res) => {
      // 응답으로부터 토큰 받기

      console.log(res.data)

      const tokenDto = JSON.stringify(res.data)

      console.log(tokenDto)

      Cookies.set('tokenDto', tokenDto)

      loginMember.value = res.data.username;

      router.push('/')
    })
    .catch((err) => {
      console.error("로그인 에러 발생 :: ", err.response.data);
    })
  }

  // 로그아웃 함수
  const logout = () => {

    const tokenDto = Cookies.get('tokenDto');
    const token = JSON.parse(tokenDto);

    axios.post(`${REST_MEMBER_API}/logout`, {}, {
      headers: { 'Authorization': `Bearer ${token.accessToken}` }
    })
    .then(() => {

      Cookies.remove('tokenDto')

      loginMember.value = null;

      router.push('/')
    })
    .catch((err) => {
      console.error("로그아웃 에러 발생 :: ", err.response.data)
    })

  }
  

  const initializeAuthState = () => {
    const tokenDto = Cookies.get('tokenDto');
    if (tokenDto) {
      const token = JSON.parse(tokenDto);
      if (token && token.username) {
        loginMember.value = token.username;
      }
    }
  }

  // Axios 인터셉터 설정
  axios.interceptors.request.use(async (config) => {

    if(config.requireAuth){
      // const accessToken = Cookies.get('accessToken')
      // const refreshToken = Cookies.get('refreshToken')

      const tokenDto = JSON.parse(Cookies.get('tokenDto'))

      let accessToken = tokenDto.accessToken
      const refreshToken = tokenDto.refreshToken
      const accessTokenExpireTime = tokenDto.accessTokenExpireTime
      const refreshTokenExpireTime = tokenDto.refreshTokenExpireTime

      if(!accessToken && !refreshToken){
        console.warn('토큰이 만료되어 재로그인이 필요합니다.')
        router.push('/login')
        return config;
      }

      // const accessTokenExpireTime = Cookies.get('accessTokenExpireTime')
      // const refreshTokenExpireTime = Cookies.get('refreshTokenExpireTime')

      const now = new Date().getTime()
      if (accessToken && accessTokenExpireTime && now > parseInt(accessTokenExpireTime)) { // accessToken 만료


        if(refreshToken && refreshTokenExpireTime && now < parseInt(refreshTokenExpireTime)){ // refreshToken 유효할 때

          try {
            const res = await axios.post(`${REST_MEMBER_API}/token/access-token/issue`, {}, {
              headers: { 'Authorization': `Bearer ${refreshToken}` }
            });

            accessToken = res.data.accessToken;
            Cookies.set('accessToken', accessToken, { expires: res.data.accessTokenExpireTime })
            config.headers.Authorization = `Bearer $`

          } catch(err) {
            console.error("액세스 토큰 재발급 에러 :: ", err)
            router.push('/login')
          }
        } else if(accessToken){
          config.headers.Authorization = `Bearer ${accessToken}`
        }
      }
    }

    return config
  }, (error) => {
    return Promise.reject(error)
  })

  return { login, logout, loginMember, initializeAuthState }
})

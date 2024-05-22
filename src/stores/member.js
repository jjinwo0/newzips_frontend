import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ref } from 'vue'

const REST_MEMBER_API = `http://localhost:8080/member`

const apiKey = import.meta.env.VITE_ENV_KAKAO_API_KEY

const loginMember = ref(null)

const profile = ref(null)

const memberId = ref('')

const role = ref('')

const memberType = ref('')

export const useMemberStore = defineStore('member', () => {

  // 로그인 함수
  const login = (username, password) => {
    axios.post(`${REST_MEMBER_API}/login`, { username, password })
    .then((res) => {
      // 응답으로부터 토큰 받기

      // console.log(res.data)

      const tokenDto = JSON.stringify(res.data)

      console.log(tokenDto)

      Cookies.set('tokenDto', tokenDto)

      loginMember.value = res.data.nickname;

      profile.value = res.data.profile

      memberId.value = res.data.id;

      role.value = res.data.role;

      memberType.value = res.data.memberType;

      router.push('/')
    })
    .catch((err) => {
      alert(err.response.data.errorMessage)
      console.error("로그인 에러 발생 :: ", err.response.data);
    })
  }

  // 로그아웃 함수
  const logout = () => {

    const tokenDto = Cookies.get('tokenDto');
    const token = JSON.parse(tokenDto);

    if(token.memberType === 'KAKAO'){

      axios.post(`${REST_MEMBER_API}/oauth/kakao/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token.accessToken}` }
      })
      .then((res) => {

        console.log(res.data.id, " :: 카카오 로그아웃 완료");

        Cookies.remove('tokenDto')

        loginMember.value = null;

        profile.value = null;

        memberId.value = null;

        role.value = null;

        memberType.value = null;

        router.push('/');
      })
      .catch((err) => {
        console.error("카카오 로그아웃 에러 발생 :: ", err.response.data)
      })
    } else {
      axios.post(`${REST_MEMBER_API}/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token.accessToken}` }
      })
      .then(() => {

        Cookies.remove('tokenDto')

        loginMember.value = null;

        profile.value = null;

        memberId.value = null;

        role.value = null;

        memberType.value = null;

        router.push('/')
      })
      .catch((err) => {
        console.error("로그아웃 에러 발생 :: ", err.response.data)
      })
    }
  }

  const kakaoLogin = () => {

    location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=http://localhost:8080/oauth/kakao/callback&response_type=code`
  }
  
  const kakaoLoginRedirect = () => {

    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const accessTokenExpireTime = params.get('accessTokenExpireTime')
    const refreshTokenExpireTime = params.get('refreshTokenExpireTime')

    console.log("accessToken :: ", accessToken)
    console.log("refreshToken :: ", refreshToken)
    console.log("accessTokenExpireTime :: ", accessTokenExpireTime)
    console.log("refreshTokenExpireTime :: ", refreshTokenExpireTime)

    if (accessToken && refreshToken){

      axios.post(`${REST_MEMBER_API}/oauth/kakao/login`, 
      { 
        memberType: 'KAKAO',
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpireTime: accessTokenExpireTime,
        refreshTokenExpireTime: refreshTokenExpireTime
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((res) => {
        console.log(res.data)

        const tokenDto = JSON.stringify(res.data)

        console.log(tokenDto)

        Cookies.set('tokenDto', tokenDto)

        loginMember.value = res.data.nickname;

        profile.value = res.data.profile;

        memberId.value = res.data.id;

        memberType.value = res.data.memberType;

        role.value = res.data.role;

        router.push('/')
      })
      .catch((err) => {
        console.error("카카오 로그인 에러 :: ", err)
      })
    }
  }

  const initializeAuthState = () => {
    const tokenDto = Cookies.get('tokenDto');
    if (tokenDto) {
      const token = JSON.parse(tokenDto);

      console.log(token)

      if (token && token.username) {
        loginMember.value = token.nickname;
        profile.value =token.profile;
        memberId.value = token.id;
        role.value = token.role;
        memberType.value = token.memberType;
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
            config.headers.Authorization = `Bearer ${accessToken}`

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

  return { login, logout, loginMember, initializeAuthState, kakaoLogin, apiKey, kakaoLoginRedirect, profile, memberId, role, memberType }
})

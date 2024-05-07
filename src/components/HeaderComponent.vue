<script setup>
import { ref, defineEmits, onMounted } from 'vue'

const userInfo = ref(null)

const emit = defineEmits(['open-login-modal', 'open-join-modal'])

const openLoginModal = () => {
  emit('open-login-modal') // HomeView로 이벤트를 전달합니다.
}

const openJoinModal = () => {
  emit('open-join-modal')
}

const logout = () => {
  const id = userInfo.value.id

  fetch(`http://localhost:8080/member/logout/${id}`, {
    method: 'POST'
  })
    .then((res) => {
      if (res.ok) {
        localStorage.removeItem('loginMember')
        userInfo.value = null
        location.reload()
      } else {
        throw new Error('Logout Failed')
      }
    })
    .catch((err) => {
      console.err('Logout Error: ', err)
    })
}

onMounted(() => {
  const loginMember = localStorage.getItem('loginMember')

  if (loginMember) userInfo.value = JSON.parse(loginMember)

  console.log(loginMember)
})
</script>

<template>
  <div>
    <nav class="navbar">
      <div>
        <RouterLink to="/">해피해피하우스</RouterLink>
      </div>

      <div style="display: flex">
        <template v-if="!userInfo">
          <button type="button" style="padding: 10px 15px" @click="openLoginModal">로그인</button>
          <button type="button" style="padding: 10px 15px" @click="openJoinModal">회원가입</button>
        </template>

        <template v-else>
          {{ userInfo.username }}님, 로그인 하였습니다.
          <a href="#" @click="logout">로그아웃</a>
        </template>

        <RouterLink to="/products">상품 목록</RouterLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar {
  background-color: #fff;
  color: #202020;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar a {
  color: #202020;
  text-decoration: none;
  padding: 10px 15px;
}

.container {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.left-handle {
  z-index: 99;
  position: absolute;
  min-width: 450px;
  min-height: 85%;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.left-handle-menu {
  font-size: 20px;
  text-align: center;
}

.left-handle-menu ul li {
  display: inline-block;
}

.input-cont {
  border: 2px solid #2564eb;
  margin-top: 30px;
  padding: 5px;
}

.list-selected {
  color: #2564eb;
  border-bottom: 5px solid #2564eb;
}

.left-handle-selector {
  margin-top: 20px;
  text-align: center;
  background-color: #f4f4f4;
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
}

.custorm-selector {
  background-color: #f4f4f4;
}

h1 {
  color: #333;
}
</style>

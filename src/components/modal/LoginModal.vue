<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update'])

const loginForm = ref({
  username: '',
  password: ''
})

const closeModal = () => {
  emit('update')
}

const handleLogin = () => {
  console.log('Login attempt with:', loginForm.value.username, loginForm.value.password)

  fetch('http://localhost:8080/member/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(loginForm.value)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('login success: ', data)
      localStorage.setItem('loginMember', JSON.stringify(data))
      closeModal() // 로그인 성공 후 모달 닫기
      location.reload()
    })
    .catch((err) => {
      console.error('Login failed: ', err)
    })
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">ID</label>
          <input type="text" id="username" v-model="loginForm.username" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="loginForm.password" required />
        </div>
        <button type="submit" style="margin-right: 10px; border-radius: 10%" @click="handleLogin">
          로그인
        </button>
        <button @click="closeModal" style="border-radius: 10%">닫기</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  margin: 28%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

button:last-child {
  background-color: #f44336;
}

button:hover {
  opacity: 0.8;
}
</style>

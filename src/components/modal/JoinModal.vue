<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update'])

const loginForm = ref({
  userId: '',
  email: '',
  password: ''
})

const closeModal = () => {
  emit('update')
}

const matchPassword = ref(false)
const confirmPassword = ref('')

watch(
  [() => loginForm.value.password, () => confirmPassword.value],
  () => {
    matchPassword.value = loginForm.value.password === confirmPassword.value
  },
  { immediate: true }
) // 컴포넌트가 마운트될 때 즉시 실행되도록 immediate 옵션 추가
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="userId">ID</label>
          <input type="text" id="userId" v-model="loginForm.userId" required />
          <span v-if="loginForm.userId.length >= 4" style="color: green">적절한 ID입니다.</span>
          <span v-if="loginForm.userId.length < 4" style="color: red"
            >ID는 최소 4자리 이상입니다.</span
          >
        </div>
        <div class="form-group">
          <label for="userId">이메일</label>
          <input type="email" v-model="loginForm.email" required />
          <span
            v-if="
              loginForm.email.includes('@') &&
              loginForm.email.length >= 4 &&
              loginForm.email.includes('.')
            "
            style="color: green"
            >적절한 이메일입니다.</span
          >
          <span v-else-if="!loginForm.email.includes('@')" style="color: red"
            >이메일에는 '@'가 포함되어야 합니다.</span
          >
          <span v-else-if="!loginForm.email.includes('.')" style="color: red"
            >이메일에는 도메인이 포함되어야 합니다.</span
          >
          <span v-if="loginForm.email.length < 4" style="color: red"
            >이메일은 최소 4자리 이상입니다.</span
          >
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="loginForm.password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">비밀번호 확인</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required />

          <span v-if="confirmPassword.length > 0 && matchPassword" style="color: green"
            >비밀번호가 일치합니다.</span
          >
          <span v-if="confirmPassword.length > 0 && !matchPassword" style="color: red"
            >비밀번호가 일치하지 않습니다.</span
          >
        </div>
        <button type="submit" style="margin-right: 10px; border-radius: 10%">로그인</button>
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

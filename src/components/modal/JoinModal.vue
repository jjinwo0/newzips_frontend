<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update'])

const joinForm = ref({
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
  [() => joinForm.value.password, () => confirmPassword.value],
  () => {
    matchPassword.value = joinForm.value.password === confirmPassword.value
  },
  { immediate: true }
) // 컴포넌트가 마운트될 때 즉시 실행되도록 immediate 옵션 추가

const handleJoin = () => {
  console.log('Join attempt with:', joinForm.value.username, joinForm.value.password)

  fetch('http://localhost:8080/member/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(joinForm.value)
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
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg ">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            회원가입
          </h3>
          <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <form @submit.prevent="handleJoin">
            <div class="mb-4">
              <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="userId">아이디</label>
                <input type="text" v-model="joinForm.userId" id="userId" name="userId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <span v-if="joinForm.userId.length >= 4" class="text-sm" style="color: green">적절한 ID입니다.</span>
                <span v-if="joinForm.userId.length < 4" class="text-sm" style="color: red">ID는 최소 4자리 이상입니다.</span>
              </div>

              <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="userEmail">이메일</label>
                <input type="email" v-model="joinForm.email" id="userEmail" name="userEmail" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <span
                  v-if=" joinForm.email.includes('@') && joinForm.email.length >= 4 && joinForm.email.includes('.')" class="text-sm" style="color: green" >
                  적절한 이메일입니다.</span >
                <span v-else-if="!joinForm.email.includes('@')" class="text-sm" style="color: red"
                >이메일에는 '@'가 포함되어야 합니다.</span
                >
                <span v-else-if="!joinForm.email.includes('.')" class="text-sm" style="color: red"
                >이메일에는 도메인이 포함되어야 합니다.</span
                >
                <span v-if="joinForm.email.length < 4" class="text-sm" style="color: red"
                >이메일은 최소 4자리 이상입니다.</span
                >
              </div>

            </div>
            <div class="form-group">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">비밀번호</label>
              <input type="password" v-model="joinForm.password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>

            <div class="form-group">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">비밀번호 확인</label>
              <input type="password" v-model="confirmPassword" id="confirm-password" name="confirm-password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>

              <span v-if="confirmPassword.length > 0 && matchPassword" class="text-sm" style="color: green"
              >비밀번호가 일치합니다.</span
              >
              <span v-if="confirmPassword.length > 0 && !matchPassword" class="text-sm" style="color: red"
              >비밀번호가 일치하지 않습니다.</span
              >
            </div>

            <div class="flex items-center justify-between">
              <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="submit">
                회원가입
              </button>
            </div>

          </form>

        </div>
      </div>
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

</style>

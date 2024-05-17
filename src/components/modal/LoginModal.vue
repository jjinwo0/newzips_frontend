<script setup>
import { ref } from 'vue'
import { useMemberStore } from '@/stores/member';

// const apiKey = import.meta.env.VITE_ENV_KAKAO_API_KEY

const store = useMemberStore()

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

  store.login(loginForm.value.username, loginForm.value.password)
  closeModal()
}

const openKakaoLogin = () => {

  store.kakaoLogin();
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
            로그인
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
          <form @submit.prevent="handleLogin">
          <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">아이디</label>
              <input type="text" id="username" name="username" v-model="loginForm.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">비밀번호</label>
              <input type="password" id="password" name="password" v-model="loginForm.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="flex items-center justify-between">
              <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="submit" @click="handleLogin">
                로그인
              </button>
            </div>

            <div class="">
              <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 text-yellow-400
                              hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="button"
                      @click="openKakaoLogin">
                <i class="fa-solid fa-comment"></i> 카카오
              </button>
              <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 text-blue-600
                              hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="button">
                <i class="fab fa-facebook-f"></i> 페이스북
              </button>
              <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 text-red-600
                              hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="button">
                <i class="fab fa-google"></i> 구글
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

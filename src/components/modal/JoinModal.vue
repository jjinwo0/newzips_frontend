<script setup>
import { ref, watch } from 'vue'
import axios from 'axios';

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update'])

const joinForm = ref({
  username: '',
  email: '',
  password: ''
})

const closeModal = () => {
  emit('update')
}

const matchPassword = ref(false)
const confirmPassword = ref('')
const validUserIdResult = ref('')
const validEmailResult = ref('')
const isConfirmed = ref(false)

watch(
  [() => joinForm.value.password, () => confirmPassword.value],
  () => {
    matchPassword.value = joinForm.value.password === confirmPassword.value
  },
  { immediate: true }
) // 컴포넌트가 마운트될 때 즉시 실행되도록 immediate 옵션 추가

const validUserId = () => {

  if(joinForm.value.username.includes(' ')){
    validUserIdResult.value = 'ID에 공백 문자는 포함할 수 없습니다.'
  }else if(joinForm.value.username.length > 0 && joinForm.value.username.length < 4){
    validUserIdResult.value = 'ID는 최소 4자리 이상입니다.'
  } else  {
    validUserIdResult.value = '';
  }
}

const validEmail = () => {
  
  if(joinForm.value.email.includes(' ')){
    validEmailResult.value = '이메일에 공백 문자는 포함할 수 없습니다.'
  } else if(!joinForm.value.email.includes('@')){
    validEmailResult.value = '이메일 형식엔 @가 필수입니다.'
  } else if(!joinForm.value.email.includes('.')) {
    validEmailResult.value = '이메일에는 도메인이 포함되어야 합니다.'
  } else {
    validEmailResult.value = ''
  }
}

const validId = () => {
  axios.get(`http://localhost:8080/member/valid/${joinForm.value.username}`)
  .then(() => {
    const confirm = window.confirm('사용 가능한 ID입니다. 사용하시겠습니까?');
    isConfirmed.value = confirm; // 사용자가 '확인'을 누른 경우 isConfirmed를 true로 설정
    console.log(isConfirmed.value)
  })
  .catch(() => {
    alert('중복된 ID 입니다.');
    isConfirmed.value = false; // 중복된 ID인 경우 isConfirmed를 false로 설정
    console.log(isConfirmed.value)
  })
}

const joinMember = () => {
  console.log('회원가입 : '+joinForm.value.username + ' ' +  joinForm.value.password + ' ' + joinForm.value.email)
  axios.post('http://localhost:8080/member/join', joinForm.value)
    .then(response => {
      // 회원가입 성공 시의 처리 로직
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 성공적으로 완료되었습니다.');
      closeModal();
      location.reload();
    })
    .catch(error => {
      // 회원가입 실패 시의 처리 로직
      console.error('회원가입 실패:', error);
      alert('회원가입 과정에서 오류가 발생하였습니다. 다시 시도해주세요.');
    });
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
          <form @submit.prevent="joinMember">
            <div class="mb-4">
              <div class="form-group mb-4" style="display: flex; align-items: center; gap: 5px;">
                <label for="userId" class="block text-gray-700 text-sm font-bold mb-0 flex-none" style="width: 80px;">아이디</label>
                <input type="text" v-model="joinForm.username" @keyup="validUserId" id="userId" name="userId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-auto" required>
                <button @click="validId" class="py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex-none" style="width: 100px;">중복확인</button>
              </div>
              <span class="text-sm flex-none" style="color: red; ">{{ validUserIdResult }}</span>

              <div class="form-group mb-4" style="display: flex; align-items: center; gap: 5px;">
                <label  class="block text-gray-700 text-sm font-bold mb-0 flex-none" style="width: 80px;" for="userEmail">이메일</label>
                <input type="email" v-model="joinForm.email" @keyup="validEmail" id="userEmail" name="userEmail" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
              </div>
              <span class="text-sm" style="color: red">{{ validEmailResult }}</span>

            </div>
            <div class="form-group mb-4" style="display: flex; align-items: center; gap: 5px;">
              <label class="block text-gray-700 text-sm font-bold mb-0 flex-none" style="width: 80px;" for="password">비밀번호</label>
              <input type="password" v-model="joinForm.password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>

            <div class="form-group mb-4" style="display: flex; align-items: center; gap: 5px;">
              <label class="block text-gray-700 text-sm font-bold mb-0 flex-none" style="width: 80px;" for="confirm-password">비밀번호확인</label>
              <input type="password" v-model="confirmPassword" id="confirm-password" name="confirm-password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
              <span v-if="confirmPassword.length > 0 && matchPassword" class="text-sm" style="color: green">비밀번호가 일치합니다.</span>
              <span v-if="confirmPassword.length > 0 && !matchPassword" class="text-sm" style="color: red">비밀번호가 일치하지 않습니다.</span>

              <button :disabled="!isConfirmed" class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="submit">
                회원가입
              </button>

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

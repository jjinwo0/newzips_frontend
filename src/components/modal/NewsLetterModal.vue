<script setup>

import { computed, onMounted } from 'vue'
import { useMemberStore } from '@/stores/member';
import axios from 'axios'
const memberStore = useMemberStore()

const loginMember = computed(() => {
  return memberStore.loginMember
})

const memberId = computed(() => {
  return memberStore.memberId
})

const emit = defineEmits(['update'])

const closeModal = () => {
  emit('update')
}

const props = defineProps({
  show: Boolean
})

const subscribe = () => {

  // 로그인 여부 확인
  if(loginMember.value === null) {
    alert("로그인을 해주세요")
    return
  }
  axios.get(`http://localhost:8080/news/check-subscribe/${memberId.value}`)
    .then((res) => {

      const isSubscribed = res.data;
      if(isSubscribed == 0) {
        if(confirm("현재 계정 이메일로 구독하시겠습니까?")) {
          axios.patch(`http://localhost:8080/news/subscribe/${memberId.value}`)
            .then(() =>{
              alert("구독되었습니다.")
              closeModal()
            })


        }
      }


    })
    .catch((e) => {
      console.log(e)
    })

}


</script>

<template>
  <div v-if="props.show" class="modal-overlay" @click.self="closeModal">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg" style="overflow-y: auto">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          </h3>
          <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg ">
          <!-- Modal body -->
          <div class="p-4 md:p-5 space-y-4">

            <div class="mostly-customized-scrollbar" style="max-height: 50vh; overflow-y: auto;">
              <div style="font-weight: bold">뉴스레터를 통해 매일 새로운 부동산 정보를 받아보세요</div>
              <img src="../../assets/image/lettersample.png" >
            </div>

            <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button" @click="subscribe">
              구독하기
            </button>

          </div>
        </div>
     </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  z-index: 20;
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
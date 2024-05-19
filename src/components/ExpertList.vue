<script setup>
import { onMounted, ref } from 'vue';
import HeaderComponent from './common/HeaderComponent.vue';
import LoginModal from './modal/LoginModal.vue';
import JoinModal from './modal/JoinModal.vue';
import { useRoomStore } from '@/stores/room';

const roomStore = useRoomStore();
const { IMP } = window;

const expertList = ref([])

const showModal = ref(false)
const showJoinModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const openJoinModal = () => {
  showJoinModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeJoinModal = () => {
  showJoinModal.value = false
}

// const showExpertDetail = (id) => {
  
// }

const payment = (price) => {
  IMP.init('imp78754551');

	
  IMP.request_pay({ // param
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: "ORD20180131-0000011",
        name: "SSAFY HOUSE",
        amount: price,
        buyer_email: "test@ssafy.com",
        buyer_name: "SSAFY USER",
        buyer_tel: "010-1234-5678",
        buyer_addr: "광주광역시 광산구 장덕동",
        buyer_postcode: "62228"
      }, rsp => { // callback
        console.log(rsp);
        if (rsp.success) {
          console.log("결제 성공");
        } else {
          console.log("결제 실패");
        }
      });
}

onMounted(() => {
  roomStore.getRoomList();

  expertList.value = roomStore.roomList;
})
</script>

<template>
  <header>
    <div>
      <HeaderComponent @open-login-modal="openModal" @open-join-modal="openJoinModal" />
    </div>
  </header>

  <div class="login-modal-container">
    <!-- 모달 컴포넌트를 여기에 추가합니다. -->
    <LoginModal :show="showModal" @update="closeModal" />
  </div>

  <div class="login-modal-container">
    <!-- 모달 컴포넌트를 여기에 추가합니다. -->
    <JoinModal :show="showJoinModal" @update="closeJoinModal" />
  </div>

  <div style="margin-top: 5rem; display: flex; justify-content: center;"><h1 style="font-size: 36px;">전문가 QnA</h1></div>

  <div class="overflow-x-auto relative sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="py-3 px-6">ID</th>
          <th scope="col" class="py-3 px-6">Name</th>
          <th scope="col" class="py-3 px-6">Price (30min)</th>
          <th scope="col" class="py-3 px-6">Detail</th>
        </tr>
      </thead>
      <tbody v-if="expertList">
        <tr v-for="expert in expertList" :key="expert.id" class="border-b odd:bg-white even:bg-gray-50">
          <td class="py-4 px-6">{{ expert.roomId }}</td>
          <td class="py-4 px-6">{{ expert.name }}</td>
          <td class="py-4 px-6">{{ expert.price }}원</td>
          <td class="py-4 px-6">
            <!-- <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    @click="showExpertDetail(expert.id)">상세 보기</button> -->
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            @click="payment(expert.price)">결제</button>                    
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

/* LoginModal 컴포넌트에 대한 스타일 */
.login-modal-container {
  position: relative;
  z-index: 2;
}

/* 테이블 컨테이너에 대한 상단 마진 추가 */
.overflow-x-auto {
  margin-top: 2rem;
  padding: 0 10rem; /* 양 옆에 1rem의 padding 추가 */
}
</style>

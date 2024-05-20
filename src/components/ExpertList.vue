<script setup>
import { onMounted, ref, computed, watchEffect } from 'vue';
import HeaderComponent from './common/HeaderComponent.vue';
import LoginModal from './modal/LoginModal.vue';
import JoinModal from './modal/JoinModal.vue';
import { useRoomStore } from '@/stores/room';
import { useMemberStore } from '@/stores/member';
import { useRouter } from 'vue-router';

const roomStore = useRoomStore();
const memberStore = useMemberStore();
const router = useRouter();

const memberId = computed(() => memberStore.memberId)

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

const moveChat = () => {
  router.push({ name: 'chat' })
}

const moveChatList = () => {
  router.push({ name: 'chat' })
}

const payment = (expert) => {
  IMP.init('imp78754551');

  const merchantUid = `ORD${Date.now()}`;
	
  IMP.request_pay({ // param
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "SSAFY HOUSE",
        amount: expert.price,
        buyer_email: "test@ssafy.com",
        buyer_name: "SSAFY USER",
        buyer_tel: "010-1234-5678",
        buyer_addr: "광주광역시 광산구 장덕동",
        buyer_postcode: "62228"
      }, rsp => { // callback
        console.log(rsp);
        if (rsp.success) {
          console.log("결제 성공");
          
          roomStore.createRoom(expert.id, memberId.value).then(() => {
            router.push({ name: 'chat' }).catch(err => {
              console.error(err);
            });
          });

        } else {
          console.log("결제 실패");
        }
      });
}

onMounted(async () => {
  // 현재 유저가 EnteredRoom에 있는 Room 이라면 getRoomList할 때 안나와야 함
  roomStore.getRoomList();

  const allRoomList = localStorage.getItem('room');

  if(allRoomList){

    expertList.value = roomStore.roomList;
  }

  console.log("mounted :: ",expertList.value)

    watchEffect(() => {
      expertList.value = roomStore.roomList;
    });
})
</script>

<template>
  <header>
    <div>
      <HeaderComponent @open-login-modal="openModal" @open-join-modal="openJoinModal" />
    </div>
  </header>

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
        <tr v-for="(expert, index) in expertList" :key="index" class="border-b odd:bg-white even:bg-gray-50">
          <td class="py-4 px-6">{{ index+1 }}</td>
          <td class="py-4 px-6">{{ expert.nickname }}</td>
          <td class="py-4 px-6">{{ expert.price }}원</td>
          <td class="py-4 px-6" v-if="!expert.isEntered">
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300 button-common"
            @click="payment(expert)">Payment</button>                    
          </td>
          <td class="py-4 px-6" v-else>
            <button class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-blue-700 transition duration-300 button-common"
            @click="moveChat">Open Chat</button>                    
          </td>
        </tr>
      </tbody>
    </table>
    <div class="fixed-button-container">
      <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-700 transition duration-300 button-common" @click="moveChatList">Open Chat List</button>
    </div>
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

.button-common {
    min-width: 120px; /* 예시 너비, 실제 요구에 맞게 조정 */
}

.fixed-button-container {
  position: fixed; /* 고정 위치 */
  bottom: 20px; /* 하단에서 20px 위 */
  right: 20px; /* 우측에서 20px 왼쪽 */
}
</style>

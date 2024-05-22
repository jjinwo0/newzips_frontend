<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoomStore } from '@/stores/room';
import WebSocket from '@/config/WebSocket';
import HeaderComponent from './HeaderComponent.vue';
import LoginModal from '../modal/LoginModal.vue';
import JoinModal from '../modal/JoinModal.vue';
import { useMemberStore } from '@/stores/member';
import { useRouter } from 'vue-router';

// Pinia store 사용
const roomStore = useRoomStore();
const memberStore = useMemberStore();

const router = useRouter();

const enteredRooms = ref([])
const enteredRoomName = ref('');
const joinRoom = ref(null);
const messages = ref([]);
const isLoading = ref(true);
const textMessage = ref('');
const loginMember = computed(() => memberStore.loginMember)
const role = computed(() => memberStore.role)

// 모달 관련 상태
const showModal = ref(false)
const showJoinModal = ref(false)
const deleteRoomId = ref(null);

// 모달 제어 함수
const openModal = () => showModal.value = true
const openJoinModal = () => showJoinModal.value = true
const closeModal = () => showModal.value = false
const closeJoinModal = () => showJoinModal.value = false

// 채팅방에 입장하는 함수
async function openChatRoom(room) {
  enteredRoomName.value = room.expertNickname;
  isLoading.value = true;
  joinRoom.value = room;

  console.log('join room :: ', joinRoom.value)

  // 특정 방의 메시지를 구독
  WebSocket.subscribeToRoom(room.room_id, (message) => {
    console.log("받은 메시지: ", message)
    messages.value.push(message);
    isLoading.value = false;
  });

  console.log('messages :: ', messages.value)

  // TODO: 여기에 사용자가 방에 입장했다는 것을 서버에 알리는 코드를 추가할 수 있습니다.
  WebSocket.enterRoom(room.room_id, { sender: memberStore.loginMember });
}

// 메시지 전송 함수
function send() {
  if (textMessage.value.trim() === '') return;

    if(joinRoom.value){
    const currentRoomId = joinRoom.value.room_id;

    console.log('전송 : ', textMessage.value);
    console.log('roomId : ', currentRoomId);
    
    if (currentRoomId) {
      WebSocket.sendMessageToRoom(memberStore.loginMember, currentRoomId, textMessage.value);

      console.log('messages::', messages.value)
      textMessage.value = ''; // 입력 필드 초기화
    }
  } 
}

const backToList = () => {
  router.push({ name: 'expert-list' })
  WebSocket.disconnect()
}

// 삭제 대상이 될 채팅방 항목 선택
const onDelete = (room) => {
  deleteRoomId.value = room.room_id;
  enteredRoomName.value = room.expertNickname;
  isLoading.value = true;
  joinRoom.value = room;

  console.log('join room :: ', joinRoom.value)

  // 특정 방의 메시지를 구독
  WebSocket.subscribeToRoom(room.id, (message) => {
    console.log("받은 메시지: ", message)
    messages.value.push(message);
    isLoading.value = false;
  });

  console.log('messages :: ', messages.value)

  // TODO: 여기에 사용자가 방에 입장했다는 것을 서버에 알리는 코드를 추가할 수 있습니다.
  WebSocket.enterRoom(room.id, { sender: memberStore.loginMember });
}

const leaveRoom = () => {

  const nowId = deleteRoomId.value; 

  if(nowId) {
    roomStore.deleteEnteredRoom(nowId);
  }
}

onMounted(() => {
  roomStore.fetchEnteredRooms().then(() => {
    // 목록 갱신 완료 후 추가 작업 (예: 로컬 스토리지에 저장)
    const storedRooms = localStorage.getItem('room');
    if (storedRooms) {
      enteredRooms.value = JSON.parse(storedRooms).enteredRooms;
    }
  });

  const storedRooms = localStorage.getItem('room');
  if (storedRooms) {
    enteredRooms.value = JSON.parse(storedRooms).enteredRooms;
  }

  WebSocket.connect(() => {
    console.log('WebSocket 연결됨');
    // WebSocket 연결 후 필요한 작업을 수행합니다.
  });
});

onBeforeUnmount(() => {
  WebSocket.disconnect();
});
</script>

<template>
  <div>
    <HeaderComponent @open-login-modal="openModal" @open-join-modal="openJoinModal" />
  </div>

  <div class="wrap bg-white" style="margin-top: 3rem;">
    <div class="container mx-auto bg-white">
      <section class="room-list">
        <section class="room-tab flex border-b">
          <div :class="{'bg-gray-200': !isAllTab}" class="flex-1 text-center py-2 all-room">내가 속한 채팅 방</div>
        </section>
        <section style="height: calc(100% - 50px); overflow: auto;">
          <keep-alive>
            <div>
              <template v-if="enteredRooms.length">
                <template v-for="(room, index) in enteredRooms" :key="index">
                  <section class="p-2" v-if="room.status === 'LIVE'">
                    <div class="room-item p-4 bg-white rounded cursor-pointer" @click="openChatRoom(room)">
                      <p>{{ room.expertNickname }}의 채팅방</p>
                    </div>
                  </section>
                  <section class="p-2" v-else>
                    <div class="expired-item p-4 bg-white rounded cursor-pointer" @click="onDelete(room)">
                      <p>{{ room.expertNickname }}의 채팅방</p>
                    </div>
                  </section>
                </template>
              </template>
            </div>
          </keep-alive>
        </section>
      </section>
      <section class="chat-area">
        <div class="chat-wrap">
          <section class="chat-header p-4 bg-gray-800 text-white">
            <p>접속 중인 방 이름 : <span>{{ enteredRoomName }}</span></p>
          </section>

          <section class="chat-list" v-if="messages">
            <template v-for="(message, index) in messages" :key="index">
              <div  :class="['w-full', 'my-2', 'flex', 'flex-col', { 'message user': message.sender === loginMember, 'message other': message.sender !== loginMember }]" >
                <!-- 로그인 멤버 정보와 메시지를 표시하는 부분 -->
                <div class="flex items-center justify-start mb-1">
                  <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <!-- 이 부분에 로그인 멤버의 이니셜을 표시할 수 있습니다. 예시로 'LM'을 넣었습니다. -->
                    {{ message.sender.substring(0, 1) }}
                  </div>
                  <div class="ml-2 text-sm text-gray-600">
                    <!-- 로그인 멤버의 이름을 표시합니다. 예시로 '로그인멤버'를 넣었습니다. -->
                    {{ message.sender }}
                  </div>
                </div>
                <!-- 메시지 내용을 표시하는 부분 -->
                <div class="w-full px-2">
                  <div class="msg bg-green-200 min-h-[60px] p-4 rounded-lg relative before:absolute before:bottom-0 before:left-10 before:border-t-8 before:border-l-8 before:border-transparent before:border-t-green-200 before:content-['']">
                    {{ message.message }}
                  </div>
                </div>
              </div>
            </template>
          </section>


          <base-spinner v-else/>

          <section class="chat-input-area flex mt-2">
            <input class="chat-input flex-1 p-2 border chat-input" type="text" @keyup.enter="send" v-model="textMessage"/>
            <button class="chat-input-send-btn ml-2 px-4 py-2 bg-blue-500 text-white" type="button" @click="send">보내기</button>
          </section>
        </div>
      </section>
    </div>
            <div class="fixed-buttons">
              <button class="list-back-btn px-4 py-2 bg-yellow-500 text-white mr-2" style="border-radius: 10%;" type="button" @click="backToList">목록으로</button>
              <button v-if="role === 'EXPERT'" class="leave-room-btn px-4 py-2 bg-red-500 text-white" style="border-radius: 10%;" type="button" @click="leaveRoom">나가기</button>
            </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");


* {
      box-sizing: border-box;
    }
    body {
      margin: 0;
    }
    html {
      font-family: "Roboto", sans-serif;
    }
    .wrap {
      width: 100%;
      height: 100%;
    }
    .container {
      width: 100%;
      height: 100%;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .room-list {
      width: 400px;
      height: 600px;
      border: 1px solid black;
      margin-right: 2px;
    }
    .room-tab {
      width: 100%;
      height: 50px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      align-items: center;
    }
    .all-room, .my-room {
      border-radius: 5px;
      padding: 10px;
      background: rgba(154, 175, 154, 0.45);
      cursor: pointer;
      transition: background 0.3s;
    }
    .all-room:hover, .my-room:hover, .active-all-room, .active-my-room {
      background: rgba(0, 245, 0, 0.85);
    }
    .room-item, .expired-item {
      width: 100%;
      height: 70px;
      border-radius: 10px;
      display: flex;
      align-content: center;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background 0.3s;
    }
    .room-item {
      background: #25ab25;
    }
    .room-item:hover {
      background: #1bce1b;
    }
    .room-item > p, .expired-item > p {
      font-size: 20px;
      font-weight: 800;
      color: white;
    }
    .expired-item {
      background: #ce3925;
    }
    .expired-item:hover {
      background: #ce631b;
    }
    .chat-area {
      width: 600px;
      height: 600px;
      border: 1px solid black;
    }
    .chat-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px;
    }
    .chat-header {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      border: 1px solid #c8c8e3;
      border-radius: 10px;
    }
    .chat-list {
      width: 100%;
      height: 100%;
      overflow: auto;
      margin-top: 20px;
      border-radius: 10px;
      border: 1px solid rgba(208, 185, 185, 0.34);
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .chat-input-area {
      width: 100%;
      height: 200px;
      background: white;
      padding: 20px;
    }
    .chat-input {
      height: 100%;
      width: 80%;
      margin-right: 20px;
      border-radius: 10px;
    }
    .chat-input-send-btn {
      height: 100%;
      width: calc(20% - 20px);
      border-radius: 10px;
      border-style: none;
    }
    .fixed-buttons {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      gap: 12px;
    }
    .message {
      max-width: 70%;
      padding: 10px;
      border-radius: 10px;
      animation: fadeIn 0.5s;
    }

    .message.user {
      align-self: flex-end;
    }

    .message.other {
      background-color: #ffffff;
      align-self: flex-start;
    }

    .message.user .msg {
      background-color: #bbffd3;
    }

    .message.other .msg {
      background-color: #f7ffb1;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
</style>

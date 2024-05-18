<template>
  <div class="wrap">
    <div class="container mx-auto">
      <section class="room-list">
        <section class="room-tab flex border-b">
          <div :class="{'bg-gray-200': isAllTab}" @click="activeTab('ALL')" class="flex-1 text-center py-2">전체 채팅 방</div>
          <div :class="{'bg-gray-200': !isAllTab}" @click="activeTab('MINE')" class="flex-1 text-center py-2">내가 속한 채팅 방</div>
        </section>
        <section style="height: calc(100% - 50px); overflow: auto;">
          <keep-alive>
            <div>
              <template v-if="isAllTab">
                <template v-for="room in rooms" :key="room.id">
                  <section class="p-2">
                    <div class="room-item p-4 bg-white shadow-md rounded cursor-pointer" @click="openChatRoom(room)">
                      <p>{{room.name}}</p>
                    </div>
                  </section>
                </template>
              </template>
              <template v-else>
                <template v-for="room in enteredRooms" :key="room.id">
                  <section class="p-2">
                    <div class="room-item p-4 bg-white shadow-md rounded cursor-pointer" @click="openChatRoom(room)">
                      <p>{{room.name}}</p>
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
            <p>접속 중인 방 이름 : <span>{{enteredRoomName}}</span></p>
          </section>

          <section class="chat-list" v-if="!isLoading">
            <template v-for="message in messages" :key="message.id">
              <div class="w-full min-h-[60px] my-2 px-2">
                <div class="bg-green-200 min-h-[60px] p-2">
                  {{message}}
                </div>
              </div>
            </template>
          </section>

          <base-spinner v-else/>


          <section class="chat-input-area flex mt-2">
            <input class="chat-input flex-1 p-2 border" type="text" @keyup.enter="send" v-model="textMessage"/>
            <button class="chat-input-send-btn ml-2 px-4 py-2 bg-blue-500 text-white" type="button" @click="send">보내기</button>
          </section>

        </div>
      </section>
    </div>
  </div>
</template>


<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
//import { useRoomStore } from '@/stores/room';
import { Client } from "@stomp/stompjs"

const store = useRoomStore()
const activeRoomTab = ref("ALL")
const rooms = ref([])
const enteredRooms = ref([])
const isLoading = ref(false)
const currentRoom = ref(null)
const websocketClient = ref(null)
const textMessage = ref("")
const messages = ref([])

const activatedRoomTab = computed(() => {
  return activeRoomTab.value === 'ALL' ? 'active-all-room' : 'all-room';
})

const activatedEnteredTab = computed(() => {
  return activeRoomTab.value === 'MINE'? 'active-my-room' : 'my-room';
})

const isAllTab = computed(() => {
  return activeRoomTab.value ==='ALL';
})

const enteredRoomName = computed(() => {
  if(!currentRoom.value) return "";
  return currentRoom.value.name;
})

const loadRooms = async () => {
  isLoading.value = true;
  try {
    await store.rooms()
    await store.enteredRooms()

    rooms.value = store.getters['user/rooms']
    enteredRooms.value = store.getters['user/enteredRooms']
  } catch(error) {
    console.error(error)
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await loadRooms()
})

onBeforeUnmount(() => {
  disconnect()
})

const activeTab = (activeTab) => {
  activeRoomTab.value = activeTab;
}

const openChatRoom = async (room) => {
  isLoading.value = true;

  await disconnect();
  currentRoom.value = room;
  clear();
  await connect();
}

const disconnect = () => {
  if(websocketClient.value) {
    websocketClient.value.deactivate();
  }
}

const connect = () => {
  const url = "ws://localhost:8080/ws/";
  websocketClient.value = new Client({
    brokerURL: url,
    onConnect: () => {
      websocketClient.value.subscribe(`/sub/room/${currentRoom.value.id}`, msg => {
        messages.value.push(msg.body);
      })

      isLoading.value = false;
    },

    onWebSocketError: () => {
      isLoading.value = false;
    },
  })

  websocketClient.value.activate();
}

const send = () => {
  if(!websocketClient.value || textMessage.value.trim() === '') return;

  websocketClient.value.publish({
    destination: `/pub/room/${currentRoom.value.id}`,
    body: JSON.stringify({message: `${textMessage.value}`, writer: "user1"}),
  });

  clear(); // Send 후 메시지 입력란을 비웁니다.
}

const clear = () => {
  textMessage.value = "";
  messages.value = [];
}

</script>



<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");


* {
  box-sizing: border-box;
}
body {
  margin: 0;
}

html {
  font-family: "ROboto", sans-serif;
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
  align-items: center
}

.all-room {
  border-radius: 5px;
  padding: 10px;
  background: rgba(154, 175, 154, 0.45);
  cursor: pointer;
}

.all-room:hover {
  background: rgba(0, 245, 0, 0.85);
}

.my-room {
  border-radius: 5px;
  padding: 10px;
  background: rgba(154, 175, 154, 0.45);
  cursor: pointer;
}
.active-my-room {
  border-radius: 5px;
  padding: 10px;
  background: rgba(0, 245, 0, 0.85);
  cursor: pointer;
}

.active-all-room {
  border-radius: 5px;
  padding: 10px;
  background: rgba(0, 245, 0, 0.85);
  cursor: pointer;
}

.my-room:hover {
  background: rgba(0, 245, 0, 0.85);
}

.room-item {
  width: 100%;
  height: 70px;
  background: #25ab25;
  border-radius: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.room-item:hover {
  background: #1bce1b;
}

.room-item > p {
  font-size: 20px;
  font-weight: 800;
  color: white;
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
  border: 1px solid rgba(208,185,185,0.34);
  padding: 10px;
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
</style>

<script setup>
import WebSocket from '@/config/WebSocket';
import { onMounted, ref } from 'vue';

const messages = ref([]);
const messageContent = ref('');
const username = ref('');

onMounted(() => {
username.value = prompt('Enter Your name: ');
  WebSocket.connect(() => {
    WebSocket.subscribe('/topic/public', message => {
      messages.value.push(message.value);
    });
    WebSocket.addUser({ sender: username.value, type: 'JOIN' });
  });
});

const sendMessage = () => {
  if (messageContent.value.trim() !== '') {
    WebSocket.sendMessage({
      sender: username.value,
      content: messageContent.value,
      type: 'CHAT'
    });

    messageContent.value = '';
    console.log(messages.value);
  }
}
</script>

<template>
  <div>
    <h1>Chat Room</h1>
    <div v-for="message in messages" :key="message.id">
      <strong>{{ message.sender }}: </strong>{{ message.content }}
    </div>
    <input type="text" v-model="messageContent" @keyup.enter="sendMessage" placeholder="Type a message...">
  </div>
</template>

<style scoped>
</style>

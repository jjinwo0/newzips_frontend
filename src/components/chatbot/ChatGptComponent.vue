<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const messages = ref([]);
const question = ref('');
let eventSource;

const initSSE = () => {
  eventSource = new EventSource('/chatGpt/askStream');
  eventSource.onmessage = (event) => {
    messages.value.push(event.data);
  };
  eventSource.onerror = (event) => {
    console.error('SSE Connection Error:', event);
    eventSource.close();
  };
};

const sendQuestion = () => {
  fetch('http://localhost:8080/chatGpt/askStream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: question.value }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to send the question');
    }
  }).catch((error) => {
    console.error('Error occurred:', error);
  });
};

onMounted(() => {
  initSSE();
});

onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close();
  }
});
</script>


<template>
    <div>
      <div id="chat-container">
        <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
      </div>
      <input v-model="question" placeholder="Enter your question" />
      <button @click="sendQuestion">Send</button>
    </div>
  </template>

<style scoped>

</style>
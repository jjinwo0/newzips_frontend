<script setup>
import { ref, reactive, defineEmits } from 'vue';

const emit = defineEmits(['closeModal'])

const messages = ref([]);
const createMessage = ref('');
const question = ref('');
let currentBotMessageId = null;
const isSending = ref(false);

// Enter 키 이벤트 핸들러
const handleKeyUp = (event) => {
  if (event.key === 'Enter' && !isSending.value) {
    sendQuestion();
  }
};

const sendQuestion = async () => {
  
  if(isSending.value) return; 
  isSending.value = true;

  const userMessage = question.value;
  
  messages.value.push({ id: Date.now(), text: userMessage, sender: 'user' });
  question.value = ''; // 입력 필드 초기화

  try {
    const response = await fetch('http://localhost:8080/chatGpt/askStream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.body) {
      throw new Error('Unable to read the stream.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let rawData = '';

    // 실시간 메시지 처리 시작
    currentBotMessageId = Date.now(); // 현재 처리 중인 bot 메시지의 고유 ID
    messages.value.push({ id: currentBotMessageId, text: '', sender: 'bot' }); // 빈 메시지로 초기화

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      rawData += decoder.decode(value, { stream: true });

      const dataChunks = rawData.split('data:').filter(chunk => chunk.trim() !== '');
      rawData = '';

      for (const chunk of dataChunks) {
        if(chunk.trim() === '[DONE]') continue;

        try {
          const parsedData = JSON.parse(chunk.trim());
          if (parsedData.choices && parsedData.choices[0].delta.content) {
            // 메시지 업데이트
            const botMessageIndex = messages.value.findIndex(msg => msg.id === currentBotMessageId);
            if (botMessageIndex !== -1) {
              messages.value[botMessageIndex].text += parsedData.choices[0].delta.content;
            }
          }
        } catch (parseError) {
          console.error('JSON parsing error :: ', parseError);
        }
      }
    }
  } catch (error) {
    console.error('Chat error :: ', error);
    messages.value.push({ id: Date.now(), text: 'An error occurred. Please try again.', sender: 'bot' });
  }finally {
    isSending.value = false; // 요청 완료 후 상태를 다시 false로 설정
  }
};
</script>

<template>
  <div class="chat-wrapper">
    <button @click="emit('closeModal')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <span class="sr-only">Close modal</span>
    </button>
    <div id="chat-container" class="chat-content">
      <div v-for="message in messages" :key="message.id" class="flex" :class="{'justify-end': message.sender === 'user', 'justify-start': message.sender === 'bot'}">
        <p class="rounded-lg p-2" :class="{'bg-blue-500 text-white': message.sender === 'user', 'bg-gray-300': message.sender === 'bot'}">{{ message.text }}</p>
      </div>
    </div>
    <div class="input-container">
      <input v-model="question" @keyup="handleKeyUp" placeholder="Enter your question" class="flex-1 border-2 border-gray-300 p-2 rounded-l-lg" />
      <button @click="sendQuestion" class="bg-blue-500 text-white p-2 rounded-r-lg">Send</button>
    </div>
  </div>
</template>


<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 600px; /* 최대 너비 */
  max-height: 300px;
  margin: auto; /* 중앙 정렬 */
}

.input-container {
  display: flex; /* 입력 필드와 버튼을 한 줄에 배치 */
  justify-content: center;
  background-color: #ffffff; /* 흰색 배경 */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); /* 상단 그림자 효과 */
  padding: 1rem; /* 내부 여백 */
  width: 600px; /* 너비 */
  max-width: 600px; /* 최대 너비 */
}

.message {
  max-width: 80%;
}

.bg-blue-500 {
  background-color: #007bff; /* 사용자 메시지 배경 색 */
}

.bg-gray-300 {
  background-color: #f8f9fa; /* 봇 메시지 배경 색 */
}

input, button {
  transition: box-shadow .3s ease;
}

input:focus, button:focus {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, .25); /* 초점 시 그림자 효과 */
}

input {
  border: 1px solid #ced4da; /* 입력 필드 테두리 */
}

button {
  transition: background-color .3s ease; /* 버튼 배경 색 전환 효과 */
}

button:hover {
  background-color: #0056b3; /* 버튼 호버 시 색 */
}

#chat-container {
  background-color: #ffffff; /* 흰색 배경 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  padding: 1rem; /* 내부 여백 */
  width: 600px; /* 최대 너비 */
  max-width: 600px; /* 최대 너비 유지 */
  margin: auto; /* 중앙 정렬 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
}

.input-wide {
  width: 100%; /* 입력 필드를 컨테이너 너비만큼 넓게 설정 */
}

.close-button {
  position: absolute; /* 버튼을 채팅 창 내에서 절대 위치로 설정 */
  top: 10px; /* 상단에서 10px 떨어진 위치 */
  left: 10px; /* 왼쪽에서 10px 떨어진 위치 */
  background-color: #f44336; /* 버튼의 배경 색상 */
  color: white; /* 버튼 내 텍스트 색상 */
  border: none; /* 테두리 없음 */
  border-radius: 50%; /* 원형 버튼 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
  padding: 5px 8px; /* 버튼 내부 여백 */
  width: 20px; /* 버튼의 너비 */
  height: 20px; /* 버튼의 높이 */
  display: flex; /* 가운데 정렬을 위한 flexbox 사용 */
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: center; /* 수평 가운데 정렬 */
}

.close-button:hover {
  background-color: #d32f2f; /* 버튼 호버 시 색상 변경 */
}
</style>

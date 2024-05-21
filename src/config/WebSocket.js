// import SockJS from "sockjs-client";
import Stomp from 'webstomp-client';

const socket = new WebSocket('ws://localhost:8080/ws');
const stompClient = Stomp.over(socket)

export default {
  connect(callback) {
    stompClient.connect({}, frame => {
      console.log('Connected: ' + frame);
      callback();
    });
  },

  // 방 입장 시 사용
  enterRoom(roomId, user) {
    stompClient.send(`/pub/room/${roomId}/entered`, JSON.stringify(user), {});
  },

  // 메시지 전송 시 사용
  sendMessageToRoom(nickname, roomId, message) {
    const chatMessage = JSON.stringify({
      sender: nickname,
      message: message,
      timestamp: new Date().toISOString()
    });
    stompClient.send(`/pub/room/${roomId}`, chatMessage,{});
  },

  // 특정 방의 메시지를 구독하기 위한 메소드
  subscribeToRoom(roomId, callback) {
    console.log(roomId)
    stompClient.subscribe(`/sub/room/${roomId}`, message => {
      console.log('Received message:', message.body); // 메시지 내용 로깅

      try {
        const parsedMessage = JSON.parse(message.body);
        console.log('parsed message :: ', parsedMessage);
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing message:', error, message.body);
      }
    });
  },
  

  // 연결 끊기
  disconnect() {
    if(stompClient !== null) {
      stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }
}

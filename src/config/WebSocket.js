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
    stompClient.send(`/app/room/${roomId}/entered`, JSON.stringify(user), {});
  },

  // 메시지 전송 시 사용
  sendMessage(roomId, message) {
    stompClient.send(`/app/room/${roomId}`, JSON.stringify(message), {});
  },

  // 특정 방의 메시지를 구독하기 위한 메소드
  subscribeToRoom(roomId, callback) {
    stompClient.subscribe(`/sub/room/${roomId}`, message => {
      callback(JSON.parse(message.body));
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

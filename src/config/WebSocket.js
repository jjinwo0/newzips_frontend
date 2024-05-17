import SockJS from "sockjs-client";
import Stomp from 'webstomp-client';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket)

export default {
  connect(callback) {
    stompClient.connect({}, frame => {
      console.log('Connected: ' + frame);
      callback();
    });
  },

  subscribe(roomId, callback) {
    stompClient.subscribe(`/sub/room/${roomId}`, message => {
      callback(JSON.parse(message.body));
    });
  },

  sendMessage(roomId, message) {
    stompClient.send(`/app/room/${roomId}`, JSON.stringify(message), {});
  },

  addUser(roomId, chat) {
    const chatMessage = {
      sender: chat.sender,
      message: `${chat.sender}님이 입장하셨습니다.` // 입장 메시지 예시
    };
    stompClient.send(`/app/room/${roomId}/entered`, JSON.stringify(chatMessage), {});
  }
}

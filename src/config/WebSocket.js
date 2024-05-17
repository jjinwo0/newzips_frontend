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

  subscribe(topic, callback) {
    stompClient.subscribe(topic, message => {
      callback(JSON.parse(message.body));
    });
  },

  sendMessage(message) {
    stompClient.send('/app/chat.sendMessage', JSON.stringify(message), {});
  },

  addUser(user) {
    stompClient.send('/app/chat.addUser', JSON.stringify(user), {});
  }
}
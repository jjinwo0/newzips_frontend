import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ref } from 'vue'

const roomList = ref([]);
const enteredRooms = ref([]);

export const useRoomStore = defineStore('room', () => {
  //전체 방 조회
  const getRoomList = async () => {

    await axios.get(`http://localhost:8080/chat/room/list`)
    .then((res) => {
      roomList.value = res.data;
      console.log(res.data);
    })
    .catch((err) => {
      console.error('방 조회 에러 발생 :: ', err);
    })
  }

  // 특정 사용자가 참여한 방 목록을 가져오는 함수입니다.
  const fetchEnteredRooms = async () => {
    const token = Cookies.get('tokenDto');
    
    // 토큰이 없는 경우, 오류 메시지를 출력하고 함수를 종료합니다.
    if(!token){
      console.error('Has No Token');
      return;
    }

    // 토큰을 파싱하여 사용자 ID를 가져옵니다.
    const tokenDto = JSON.parse(token);
    const memberId = tokenDto.id;

    // axios를 이용하여 API 호출을 수행합니다.
    await axios.get(`http://localhost:8080/chat/room/joined/${memberId}`)
      .then((res) => {
        enteredRooms.value = res.data; // API 응답으로 받은 데이터를 enteredRooms에 할당합니다.
      })
      .catch((err) => {
        console.error('Get Entered Rooms Failed :: ', err); // 오류 발생 시 콘솔에 오류 메시지를 출력합니다.
      });
  };

  // 스토어의 상태와 함수를 반환합니다.
  return { enteredRooms, fetchEnteredRooms, roomList, getRoomList };
}, { persist: true });

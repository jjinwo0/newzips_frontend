import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ref } from 'vue'

const roomList = ref([]);
const enteredRooms = ref([]);

export const useRoomStore = defineStore('room', () => {

  // 방 생성
  const createRoom = async (expertId, memberId) => {

    await axios.post(`http://localhost:8080/chat/room/init/${expertId}/${memberId}`)
    .then((res) => {
      console.log(res.data, " is create chat room.");
    })
    .catch((err) => {
      console.error('채팅방 생성 오류 :: ', err);
    })
  }

  //전체 방 조회
  const getRoomList = async () => {

    await fetchEnteredRooms();
    const token = Cookies.get('tokenDto');
    
    if(!token){
      console.error('Has No Token');
      return;
    }

    const tokenDto = JSON.parse(token);

    await axios.get(`http://localhost:8080/member/list/expert`, {
      headers: {
        'Authorization': `Bearer ${tokenDto.accessToken}`
      }
    })
    .then((res) => {

      // 방 목록에 대해 반복하면서 각 방이 enteredRooms에 존재하는지 확인
      const updatedRoomList = res.data.map(expert => {
          const isEntered = enteredRooms.value.some(
            enteredRoom => enteredRoom.expert_id === expert.id
            &&
            enteredRoom.status !== 'EXPIRED'
          );
  
          // isEntered 결과를 기반으로 새로운 객체를 생성하여 반환
          return { ...expert, isEntered };
        })

      roomList.value = updatedRoomList;
      console.log("updatedList :: ", updatedRoomList);
      console.log(roomList.value)
      console.log(enteredRooms.value)
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

    if(tokenDto.role === 'USER' || tokenDto.role === 'ADMIN'){
    // axios를 이용하여 API 호출을 수행합니다.
    await axios.get(`http://localhost:8080/chat/room/joined/${memberId}`)
      .then((res) => {
        enteredRooms.value = res.data; // API 응답으로 받은 데이터를 enteredRooms에 할당합니다.

        console.log("joined :: ", enteredRooms.value)
      })
      .catch((err) => {
        console.error('Get Entered Rooms Failed :: ', err); // 오류 발생 시 콘솔에 오류 메시지를 출력합니다.
      });
    } else if(tokenDto.role === 'EXPERT'){

      await axios.get(`http://localhost:8080/chat/room/joined/expert/${memberId}`)
      .then((res) => {
        enteredRooms.value = res.data; // API 응답으로 받은 데이터를 enteredRooms에 할당합니다.
      })
      .catch((err) => {
        console.error('Get Entered Rooms Failed :: ', err); // 오류 발생 시 콘솔에 오류 메시지를 출력합니다.
      });
    }
  };

  const deleteEnteredRoom = async (id) => {

    const token = Cookies.get('tokenDto');
    
    if(!token){
      console.error('Has No Token');
      return;
    }

    const tokenDto = JSON.parse(token);
    const role = tokenDto.role;

    if (role !== 'EXPERT') {
      console.warn('Unauthorized: Only EXPERT role can perform this action');
      return;
    }

    const confirm = window.confirm('정말로 이 방을 나가시겠습니까?');

    if(confirm){

      await axios.delete(`http://localhost:8080/chat/room/quit/${id}`)
      .then(() => {
        const index = enteredRooms.value.findIndex(room => room.room_id === id);
        if (index !== -1) {
          enteredRooms.value.splice(index, 1); // 해당 인덱스의 요소를 배열에서 제거합니다.
        }
      })
      .catch((err) => {
        console.error('방 나가기 실패 :: ', err);
      })
    }
  }

  // 스토어의 상태와 함수를 반환합니다.
  return { enteredRooms, fetchEnteredRooms, roomList, getRoomList, deleteEnteredRoom, createRoom };
}, { persist: true });

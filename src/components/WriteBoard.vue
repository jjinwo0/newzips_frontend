<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()

const newBoard = ref({
  title: '',
  content: '',
  author: ''
})

// 게시물 작성 함수
const writeBoard = async () => {
  // localStorage에서 로그인한 사용자의 username을 가져옵니다.
  const loginMember = JSON.parse(localStorage.getItem('loginMember'));
  if (!loginMember || !loginMember.username) {
    alert('로그인이 필요합니다.');
    return;
  }
  newBoard.value.author = loginMember.username; // 작성자 필드 설정

  try {
    // 서버에 게시물 작성 API 호출
    await axios.post('http://localhost:8080/board/write', newBoard.value);
    alert('게시글이 성공적으로 작성되었습니다.');
    router.push({ name: 'board-list' }); // 게시물 목록 페이지로 리다이렉트
  } catch (error) {
    console.error(error);
    alert('게시글 작성에 실패했습니다.');
  }
}

const cancel = () => {
  router.go(-1); // 이전 페이지로 이동
};
</script>

<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <!-- 게시물 내용을 테이블 형식으로 표시 -->
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">제목</th>
              <td><input type="text" v-model="newBoard.title" /></td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td><textarea v-model="newBoard.content" cols="30" rows="10"></textarea></td>
            </tr>
          </tbody>
        </table>
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="writeBoard">작성 완료</button>
          <button type="button" class="btn btn-danger" @click="cancel">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table th {
  width: 20%;
}
.table td {
  width: 80%;
}
/* 버튼 정렬을 위한 스타일 */
.text-end {
  text-align: right;
}
</style>

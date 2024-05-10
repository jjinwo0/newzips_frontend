<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const id = ref(route.params.id);

const title = ref('');
const content = ref('');
const author = ref('');

const updateBoard = () => {
  // 수정할 데이터를 서버로 전송합니다.
  axios.patch(`http://localhost:8080/board/update/${id.value}`, {
    title: title.value,
    content: content.value,
  })
  .then(() => {
    console.log('수정 완료');
    router.push({ name: 'board-list' }); // 수정 성공 후 게시판 목록으로 이동
  })
  .catch((err) => {
    console.error(err);
  });
};

const getBoard = () => {
  axios.get(`http://localhost:8080/board/list/${id.value}`)
  .then((res) => {
    console.log(res.data);
    title.value = res.data.title;
    content.value = res.data.content;
    author.value = res.data.author;
  })
  .catch((err) => {
    console.error(err);
  });
};

const cancel = () => {
  router.go(-1); // 이전 페이지로 이동
  // 또는 router.push('/board/list'); // 게시판 목록으로 이동
};

onMounted(() => {
  getBoard();
});
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
              <td><input type="text" v-model="title" /></td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td><textarea v-model="content" cols="30" rows="10"></textarea></td>
            </tr>
            <tr>
              <th scope="row">작성자</th>
              <td><input type="text" v-model="author" readonly/></td>
            </tr>
          </tbody>
        </table>
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="updateBoard">수정</button>
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

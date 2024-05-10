<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()

const id = ref(route.params.id)

const board = ref({})

const getBoard = () => {
  axios.get(`http://localhost:8080/board/list/${id.value}`)
  .then((res) => {
    console.log(res.data)
    board.value = res.data;
  })
  .catch((err) => {
    console.error(err)
  })
}

const deleteBoard = () => {
  axios.delete(`http://localhost:8080/board/delete/${id.value}`)
  .then(() => {
    alert('삭제 완료')
    router.push({ name: 'board-list' })
  })
  .catch((err) => {
    console.error(err);
  })
}

const moveUpdate = () => {
  router.push({ name: 'board-update', params:{ id: id.value } });
}

onMounted(() => {
  getBoard()
})
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
              <td>{{ board.title }}</td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td>{{ board.content }}</td>
            </tr>
            <tr>
              <th scope="row">작성자</th>
              <td>{{ board.author }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="moveUpdate">수정</button>
          <button type="button" class="btn btn-danger" @click="deleteBoard">삭제</button>
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

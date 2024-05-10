<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const boardList = ref([])

const getBoardList = () => {
  axios.get('http://localhost:8080/board/list')
  .then((res) => {
    console.log(res.data)
    boardList.value = res.data
  })
  .catch((err) => {
    console.error(err)
  })
}

onMounted(() => {
  getBoardList()
})
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-3 text-center">공지사항</h2>
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="table-header">
          <tr>
            <th scope="col" class="text-center">No</th>
            <th scope="col">제목</th>
            <th scope="col">작성일</th>
            <th scope="col">최종수정일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(board, index) in boardList" :key="board.id" :class="{'table-row-light': index % 2 === 0, 'table-row-dark': index % 2 !== 0}">
            <th scope="row" class="text-center">{{ board.id }}</th>
            <td><router-link :to="{ name: 'board-detail', params: { id: board.id }}">{{ board.title }}</router-link></td>
            <td>{{ board.createdAt }}</td>
            <td>{{ board.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 새 글 작성 버튼 추가 -->
    <div class="text-end pb-3">
      <router-link to="/board/write" class="btn btn-primary">새 글 작성</router-link>
    </div>
  </div>
</template>

<style scoped>
.table th, .table td {
  padding: 1rem;
}

.table-header {
  background-color: #a3d2ca; /* 파스텔 블루 */
}

.table-row-light {
  background-color: #fcefe9; /* 파스텔 그린 */
}

.table-row-dark {
  background-color: #ffffff; /* 화이트 */
}

.table-bordered,
.table-bordered th,
.table-bordered td {
  border: 2px solid #e2eafc; /* 경계선 색상 */
}
</style>
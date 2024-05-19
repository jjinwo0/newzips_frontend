<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import HeaderComponent from '@/components/common/HeaderComponent.vue'

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

const extractText = (text) => {
  // 정규 표현식을 사용하여 텍스트에서 한글과 영문자만 추출
  return text.replace(/[^\가-힣a-zA-Z \n]/g, '');
}

onMounted(() => {
  getBoardList()
})
</script>

<template>
  <HeaderComponent />
  <div class="board-container">
    <div class="bg-gradient-to-r" style="background: linear-gradient(to right, #06b6d4, #76aaff);">
      <div style="padding: 0 10%">
        <div style="display: flex; justify-content: end">
          <img src="@/assets/image/board-background.gif" style="width: 170px; float: right;">
        </div>
        <div class="font-bold text-3xl text-white" style="text-align: center">공지사항</div>
        <img src="@/assets/image/board-background2.png" style="width: 170px;">
      </div>
    </div>

    <div style="padding: 0 10%">
      <div class="board-content">
        <div style="width: 100%; height: 50px; text-align: right;">
          <router-link to="/board/write" class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow-lg">
            글쓰기
          </router-link>
        </div>

        <template v-for="(board, index) in boardList" :key="board.id" >
          <router-link :to="{ name: 'board-detail', params: { id: board.id }}">
          <!-- 게시글 -->
          <div style="padding: 20px 20px 0px; gap:20px; display: grid;">
            <span class="text-gray-900">{{ board.title }}</span>
            <div class="text-gray-500">
              {{ extractText(board.content) }}
            </div>
            <div style="display: flex; justify-content: space-between">
<!--            <div style="display:flex; column-gap: 1rem; align-items: center;">-->
<!--              <i class="fa-regular fa-message"></i><span>2</span>-->
<!--              <i class="fa-regular fa-eye"></i><span>3</span>-->
<!--            </div>-->
              <span class="text-gray-400">{{ board.createdAt }}</span>
            </div>
            <hr>
          </div>
          </router-link>
        </template>

      </div>
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
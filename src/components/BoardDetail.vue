<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import '@toast-ui/editor/dist/toastui-editor-viewer.css'; // Viewer 스타일
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import HeaderComponent from '@/components/common/HeaderComponent.vue'
import { useMemberStore } from '@/stores/member.js'


const route = useRoute()
const router = useRouter()

const id = ref(route.params.id)
const board = ref({})

const memberStore = useMemberStore()

const viewerRef = ref(null);
let viewerInstance = null

const getBoard = async () => {
  await axios.get(`http://localhost:8080/board/list/${id.value}`)
  .then((res) => {
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

onMounted(async () => {
  await getBoard()

  viewerInstance = new Viewer({
    el: viewerRef.value,
    height: '600px',
    initialValue: board.value.content
  });

  console.log(viewerInstance)

})

//console.log(board.value.content)
//console.log(viewerInstance)
//
// viewerInstance.setMarkdown(board.value.content)
</script>

<template>
  <HeaderComponent />

  <div class="board-container" >
    <div style="padding: 0 10%">
      <div class="board-content" style="min-height: 80vh; display: flex; flex-direction: column;justify-content: space-between;">
        <div style="margin: 20px 0px; ">
          <textarea @keyup="autoResize" type="text" ref="titleRef" class="text-3xl" maxlength="80" rows="1"
                    style=" width: 100%; overflow-y: hidden; padding: 15px 5px; resize: none; box-sizing: border-box;" placeholder="제목을 입력하세요." v-model="board.title"/>
          <div ref="viewerRef" ></div>
        </div>
        <template v-if=" memberStore.role === 'ADMIN'">
        <div style="display:flex; column-gap: 0.5rem; align-items: center; justify-content: flex-end; margin-top: 10px">
          <button class="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded shadow-lg" @click="deleteBoard">삭제</button>
          <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow-lg" @click="moveUpdate">수정</button>
        </div>
      </template>
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

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderComponent from '@/components/common/HeaderComponent.vue'
// 토스트 에디터
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css';

const route = useRoute();
const router = useRouter();

const id = ref(route.params.id);

const title = ref('');
const content = ref('');
const author = ref('');

const titleRef = ref(null);

const editor = ref(null);
let editorInstance = null

//마운트될때 Editor 생성
onMounted(() => {
  editorInstance = new Editor({
    el: editor.value,
    height: '500px',
    //'wysiwyg', 'markdown' 택 1
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    hooks: {
      addImageBlobHook(blob, cllback) {
        console.log(blob);
        console.log(callback);
      }
    }
  })

  getBoard();

  autoResize();
});

// 제목 리사이징
const autoResize = () => {
  const textarea = titleRef.value;
  textarea.style.height = `auto`
  textarea.style.height = `${textarea.scrollHeight}px`
};


const updateBoard = () => {

  // 수정할 데이터를 서버로 전송합니다.
  axios.patch(`http://localhost:8080/board/update/${id.value}`, {

    title: title.value,
    content: editorInstance.getMarkdown(),
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
    author.value = res.data.author;

    // 에디터에 값을 반영한다.
    editorInstance.setMarkdown(res.data.content);

  })
  .catch((err) => {
    console.error(err);
  });
};

const cancel = () => {
  router.go(-1); // 이전 페이지로 이동
  // 또는 router.push('/board/list'); // 게시판 목록으로 이동
};

</script>

<template>
  <header-component />
  <div class="board-container">
    <div class="bg-gradient-to-r" style="background: linear-gradient(to right, #06b6d4, #76aaff);">
      <div style="padding: 0 10%">
        <div style="display: flex; justify-content: end">
          <img src="@/assets/image/board-background.gif" style="width: 170px; float: right;">
        </div>
        <div class="font-bold text-3xl text-white" style="text-align: center">공지사항 수정</div>
        <img src="@/assets/image/board-background2.png" style="width: 170px;">
      </div>
    </div>

    <div style="padding: 0 10%">
      <div class="board-content">
        <div style="margin: 20px 0px; ">
          <textarea @keyup="autoResize" type="text" ref="titleRef" class="text-3xl" maxlength="80" rows="1"
                    style=" width: 100%; overflow-y: hidden; padding: 15px 5px; resize: none; box-sizing: border-box;" placeholder="제목을 입력하세요." v-model="title" />
        </div>
        <div ref="editor" />
        <div style="display:flex; column-gap: 0.5rem; align-items: center; justify-content: flex-end; margin-top: 10px">
          <button type="button" class="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded shadow-lg" @click="cancel">취소</button>
          <button type="button" class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow-lg" @click="updateBoard">수정</button>

        </div>
      </div>
    </div>
  </div>




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

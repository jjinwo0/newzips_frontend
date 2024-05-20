<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from '@/components/common/HeaderComponent.vue'

// 토스트 에디터
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css';

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
  });

  autoResize();
});

const router = useRouter()

const titleRef = ref(null);

// 제목 리사이징
const autoResize = () => {
  const textarea = titleRef.value;
  textarea.style.height = `auto`
  textarea.style.height = `${textarea.scrollHeight}px`
};

const newBoard = ref({
  title: '',
  content: '',
  author: ''
})

// 게시물 작성 함수
const writeBoard = async () => {

  // localStorage에서 로그인한 사용자의 username을 가져옵니다.
  const loginMember = {username : 'username'}

  // if (!loginMember || !loginMember.username) {
  //   alert('로그인이 필요합니다.');
  //   return;
  // }

  newBoard.value.author = loginMember.username; // 작성자 필드 설정
  newBoard.value.content = editorInstance.getMarkdown() // 작성한 마크다운 컨텐츠

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

  <header-component />
  <div class="board-container">


    <div class="bg-gradient-to-r" style="background: linear-gradient(to right, #06b6d4, #76aaff);">
      <div style="padding: 0 10%">
        <div style="display: flex; justify-content: end">
          <img src="@/assets/image/board-background.gif" style="width: 170px; float: right;">
        </div>
        <div class="font-bold text-3xl text-white" style="text-align: center">공지사항 작성</div>
        <img src="@/assets/image/board-background2.png" style="width: 170px;">
      </div>
    </div>


    <div style="padding: 0 10%">
      <div class="board-content">
        <div style="margin: 20px 0px; ">
          <textarea @keyup="autoResize" type="text" ref="titleRef" class="text-3xl" maxlength="80" rows="1"
                    style=" width: 100%; overflow-y: hidden; padding: 15px 5px; resize: none; box-sizing: border-box;" placeholder="제목을 입력하세요." v-model="newBoard.title"/>
        </div>
        <div ref="editor" />
        <div style="display:flex; column-gap: 0.5rem; align-items: center; justify-content: flex-end; margin-top: 10px">
          <button class="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded shadow-lg"  @click="cancel">취소</button>
          <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow-lg" @click="writeBoard">작성 완료</button>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>

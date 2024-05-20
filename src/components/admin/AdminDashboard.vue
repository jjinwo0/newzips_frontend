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
const titleRef = ref(null)

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

</script>

<template>

  <HeaderComponent />
  <div class="board-container" style="background: linear-gradient(to bottom, rgba(6, 182, 212, 1) 40%, rgba(6, 182, 212, 0) 30%),  #fff 70%;">
    <div style="padding: 0 10%">

      <div class="board-content">
        <div style="width: 100%; height: 50px;">
          <span class="text-gray-900">
            뉴스레터 어시스트
          </span>
        </div>
      </div>

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
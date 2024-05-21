<script setup>
import axios from "axios";
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from "vue-router";
import HeaderComponent from '@/components/common/HeaderComponent.vue'

// 토스트 에디터
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css';

const editor = ref(null);
let editorInstance = null
const titleRef = ref(null)
const answerRef = ref(null)
const isLoading = ref(false);
const isLoadingAnswer = ref(false);

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
})

const result = ref(null);

// AI를 활용해서 당일 뉴스를 요약해서 생성
const getSummaryOfTodatNews = async () => {

  isLoading.value = true;
  isLoadingAnswer.value = false;
  axios.get(`http://localhost:8080/news/summarize-today`)
    .then((res) => {
      //choices 배열의 각 message.content를 추출하여 합친 문자열을 생성
      const summaries = res.data.map(item => {
        const parsedItem = JSON.parse(item);
        return parsedItem.choices[0].message.content;
      })
      const resultNews = summaries.join('\n\n');
      isLoadingAnswer.value = true;

      answerRef.value.innerText = resultNews

    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      isLoading.value = false;
    })
}

const sendNewsLetter = async () =>  {

  if(confirm('전송하시겠습니까?')) {
    newBoard.value.content = editorInstance.getMarkdown() // 작성한 마크다운 컨텐츠
    await axios.post('http://localhost:8080/news/send-letter', newBoard.value)
      .then((res) => {
        if(res.status === 200) {
          alert('전송이 완료되었습니다')
          newBoard.value.title = ''
          newBoard.value.content =''
          editorInstance.setMarkdown('')
        }
      })
      .catch((e) => console.log(e))
  }


}


</script>

<template>

  <HeaderComponent />
  <div class="board-container" style="background: linear-gradient(to bottom, rgba(6, 182, 212, 1) 40%, rgba(6, 182, 212, 0) 30%),  #fff 70%;">
    <div style="padding: 0 10%">

      <div class="board-content">
        <div style="width: 100%; height: 50px;display: flex;justify-content: space-between;align-items: center;">
          <span class="text-gray-900">
            뉴스레터 작성 AI 어시스트
          </span>
          <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow-lg" @click="getSummaryOfTodatNews">당일 뉴스 요약</button>
        </div>
        <div v-if="isLoading" style="width: 100%; display: flex; justify-content: center">
          <img src="@/assets/image/loading.gif">
        </div>
        <div ref="answerRef" v-show="isLoadingAnswer" style="width: 100%; margin-top: 20px;padding: 15px; border: 1px solid #b5b5b5; height: auto;">
        </div>
      </div>

      <div class="board-content">
        <div style="margin: 20px 0px; ">



          <textarea @keyup="autoResize" type="text" ref="titleRef" class="text-3xl" maxlength="80" rows="1"
                    style=" width: 100%; overflow-y: hidden; padding: 15px 5px; resize: none; box-sizing: border-box;" placeholder="제목을 입력하세요." v-model="newBoard.title"/>
        </div>
        <div ref="editor" />
        <div style="display:flex; column-gap: 0.5rem; align-items: center; justify-content: flex-end; margin-top: 10px">
          <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow-lg" @click="sendNewsLetter">작성 완료</button>
        </div>
      </div>
    </div>






  </div>

</template>

<style scoped>

</style>
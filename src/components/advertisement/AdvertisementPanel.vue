<script setup>

import {ref} from 'vue'
import NewsLetterModal from '@/components/modal/NewsLetterModal.vue'

// 모달관련상태
const showNewsLetterModal = ref(false)
const openNewsLetterModal = () => {

  showNewsLetterModal.value = !showNewsLetterModal.value
}
const closeNewsLetterModal = () => {
  showNewsLetterModal.value = false
}
</script>


<template>
  <div class="ad-panel" @click="openNewsLetterModal">
    <div class="ad-contents text-sm" >
      부동산 정보를 이제 구독하세요!
    </div>
  </div>

  <NewsLetterModal :show="showNewsLetterModal" @update="closeNewsLetterModal" />
</template>

<style scoped>

</style>
<script setup>
import HeaderComponent from '@/components/common/HeaderComponent.vue'
import MapWrap from '@/components/map/MapWrap.vue'
import LoginModal from '@/components/modal/LoginModal.vue'
import JoinModal from '@/components/modal/JoinModal.vue'
import { ref } from 'vue'

const showModal = ref(false)
const showJoinModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const openJoinModal = () => {
  showJoinModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeJoinModal = () => {
  showJoinModal.value = false
}
</script>

<template>
  <header>
    <div>
      <HeaderComponent @open-login-modal="openModal" @open-join-modal="openJoinModal" />
    </div>
  </header>

  <main>
    <div class="login-modal-container">
      <!-- 모달 컴포넌트를 여기에 추가합니다. -->
      <LoginModal :show="showModal" @update="closeModal" />
    </div>

    <div class="login-modal-container">
      <!-- 모달 컴포넌트를 여기에 추가합니다. -->
      <JoinModal :show="showJoinModal" @update="closeJoinModal" />
    </div>

    <div class="kakao-map-container">
      <MapWrap />
    </div>
  </main>
</template>

<style scoped>
.kakao-map-container {
  position: relative;
  z-index: 1;
}

/* LoginModal 컴포넌트에 대한 스타일 */
.login-modal-container {
  position: relative;
  z-index: 2;
}
</style>

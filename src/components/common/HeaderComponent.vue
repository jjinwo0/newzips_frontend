<script setup>
import { ref, defineEmits, computed } from 'vue'
import { useMemberStore } from '@/stores/member';
import JoinModal from '@/components/modal/JoinModal.vue'
import LoginModal from '@/components/modal/LoginModal.vue'

const memberStore = useMemberStore()
const loginMember = computed(() => {
  return memberStore.loginMember
})
const role = computed(() => {
  return memberStore.role
})

const profile = computed(() => memberStore.profile)

const emit = defineEmits(['open-login-modal', 'open-join-modal'])


// 모달 관련 상태
const showModal = ref(false)
const showJoinModal = ref(false)

// 모달 제어 함수
const openLoginModal = () => showModal.value = true
const openJoinModal = () => showJoinModal.value = true
const closeModal = () => showModal.value = false
const closeJoinModal = () => showJoinModal.value = false

const logout = () => {

  const confirm = window.confirm('로그아웃 하시겠습니까?');
  

  if(confirm){
    memberStore.logout()
    loginMember.value = null;
  }
}
</script>

<template>

  <div>
    <nav class="navbar">
      <div>
        <RouterLink to="/">
          <img src="@/assets/image/logo.png" style="width: 140px;margin-left: 25px;margin-top: 10px;">
        </RouterLink>
      </div>

      <div style="display: flex">
        <template v-if="loginMember === null">
          <button type="button" style="padding: 10px 15px" @click="openLoginModal">로그인</button>
          <button type="button" style="padding: 10px 15px" @click="openJoinModal">회원가입</button>
        </template>

        <template v-else>
          <div style="margin-top: 5px;">
            <img :src="profile" alt="" class="profile-image">
          </div>
          <div style="padding: 10px 15px;">
            안녕하세요 <span class="font-bold">{{ loginMember }}</span> 님
          </div>
          <a href="#" @click="logout">로그아웃</a>
        </template>

        <RouterLink to="/admin/dashboard" v-if=" role === 'ADMIN'">관리자 페이지</RouterLink>
        <RouterLink to="/expert">전문가 Q&A</RouterLink>
        <RouterLink to="/board">공지사항</RouterLink>

        <div class="login-modal-container">
          <!-- 모달 컴포넌트를 여기에 추가합니다. -->
          <LoginModal :show="showModal" @update="closeModal" />
        </div>

        <div class="login-modal-container">
          <!-- 모달 컴포넌트를 여기에 추가합니다. -->
          <JoinModal :show="showJoinModal" @update="closeJoinModal" />
        </div>

      </div>
    </nav>
  </div>
</template>

<style scoped>
.profile-image {
  width: 30px;
  weight: 30px
}
</style>

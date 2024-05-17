<script setup>
import { ref, defineEmits, computed } from 'vue'
import { useMemberStore } from '@/stores/member';

const memberStore = useMemberStore()

const loginMember = computed(() => memberStore.loginMember)

const profile = computed(() => memberStore.profile)

const emit = defineEmits(['open-login-modal', 'open-join-modal'])

const openLoginModal = () => {
  emit('open-login-modal') // HomeView로 이벤트를 전달합니다.
}

const openJoinModal = () => {
  emit('open-join-modal')
}

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
        <RouterLink to="/">해피해피하우스</RouterLink>
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

        <RouterLink to="/expert">전문가 Q&A</RouterLink>
        <RouterLink to="/board">공지사항</RouterLink>
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

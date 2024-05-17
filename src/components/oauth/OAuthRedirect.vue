<script setup>
import { useMemberStore } from '@/stores/member';
import { onMounted } from 'vue';

const store = useMemberStore()

onMounted(() => {

    store.kakaoLoginRedirect()
})
</script>

<template>
    <div>
        
    </div>
</template>

<style scoped>

</style>
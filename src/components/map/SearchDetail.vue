<script setup>
import { useHouseStore } from '@/stores/house';
import { ref } from 'vue';

const store = useHouseStore()

const detail = ref(store.detailData);
</script>

<template>
    <div class="left-handle">
        <div class="left-handle-menu">
            {{ store.nowLat }}
        </div>
    </div>
</template>

<style scoped>

</style>
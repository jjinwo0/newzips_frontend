<script setup>

import { ref, computed, onMounted, watch } from 'vue'
import { useMemberStore } from '@/stores/member';
import axios from "axios";

const emit = defineEmits(['update'])

const closeModal = () => {
  emit('update')
}


const props = defineProps({
  id: Number,
  show: Boolean
})

watch(
  () => [props.id],
  () => {
    updateAuctionInfo();
  }
);

const auction = ref('')

const updateAuctionInfo = () => {
  axios.get(`http://localhost:8080/auction/info/${props.id}`)
    .then((res) => {
      auction.value = res.data
      console.log(res.data)
    })
}


</script>

<template>
  <div v-if="props.show" class="modal-overlay" @click.self="closeModal">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg" style="overflow-y: auto">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">경매 정보
          </h3>
          <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg ">
          <!-- Modal body -->
          <div class="p-4 md:p-5 space-y-4">

            <div class="mostly-customized-scrollbar" style="max-height: 50vh; overflow-y: auto;">

              <div class="details space-y-2">
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">법원:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.court }}</div>
                </div>
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">용도:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.productUsage }}</div>
                </div>
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">소재지 및 내역:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.location }}</div>
                </div>
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">감정평가액:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.appraisalValue }}</div>
                </div>
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">최저매각가격:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.minimumSalePrice}}</div>
                </div>
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">매각기일:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.saleDate }}</div>
                </div>
                <div class="row flex items-center">
                  <div class="label w-1/3 font-medium text-gray-700">진행상태:</div>
                  <div class="value w-2/3 text-gray-900">{{ auction.status }}</div>
                </div>
              </div>

            </div>

          </div>
        </div>
     </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
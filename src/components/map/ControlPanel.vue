<script setup>
import axios from 'axios'
import { ref } from 'vue'
import SearchDetail from './SearchDetail.vue';

const inputName = ref('')

const searchResult = ref([])

const openDetail = ref(false)

const searchByName = () => {
  axios
    .get(`http://localhost:8080/house/list/name/${inputName.value}`)
    .then((res) => {
      console.log(res.data)
      searchResult.value = res.data
    })
    .catch((err) => {
      console.error('이름 검색 예외 발생 :: ', err)
    })
}

const showDetails = (aptCode) => {
  axios
    .get(`http://localhost:8080/house/detail/${aptCode}`)
    .then((res) => {
      console.log(res)
      openDetail.value = true;
    })
    .catch((err) => {
      console.error('조회 에러 발생 :: ', err)
    })
} 
</script>

<template>
  <div style="padding: 2.8em 2em 2em 2em;" v-if="!openDetail">
    <div class="left-handle">
      <div class="left-handle-menu">
        <ul>
          <li class="list-selected">아파트</li>
        </ul>
      </div>

      <div class="flex input-cont">
        <input type="text" v-model="inputName" id="houseNameSearchForm" class="focus:outline-none flex-grow" style="flex-basis: 80%" placeholder="아파트명을 검색해보세요"/>
        <button class="w-2/10 py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" id="name-search-btn" @click="searchByName">
          검색
        </button>
      </div>

      <div class="left-handle-selector">
        <form id="houseSearchForm">
          <select class="custom-selector" id="sido" name="sido">
            <option value="none">시도 선택</option>
          </select>
          <select class="custom-selector" id="gugun" name="gugun">
            <option value="none">시군구 선택</option>
          </select>
          <select class="custom-selector" id="dong" name="dong">
            <option value="none">읍면동 선택</option>
          </select>
        </form>
      </div>
      <!-- 시도/군구/읍면동 선택 끝 -->

      <div class="mt-5">
        <button
          class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          id="list-btn"
          type="button"
        >
          검색
        </button>
      </div>

      <div class="list-cont mt-5 overflow-y-auto mostly-customized-scrollbar" v-if="searchResult.length > 0">
        <section id="listContSection">
          <article v-for="apart in searchResult" :key="apart.aptCode" @click="showDetails(apart.aptCode)" class="block mb-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 p-3 cursor-pointer">
            <div>
              <div class="grid font-semibold text-blue-500 flex flex-wrap items-center gap-1">
                <div class="flex">
                  <span class="text-xs font-semibold bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-purple-900 px-2.5 py-0.5 rounded flex items-center justify-center m-0 h-6 mr-1">건물명</span>
                  <p class="h3">{{ apart.apartmentName }}</p>
                </div>
                <div class="flex">
                  <span class="text-xs font-semibold bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-purple-900 px-2.5 py-0.5 rounded flex items-center justify-center m-0 h-6">도로명</span>
                  <span class="text-sm text-black font-normal ml-1">{{ apart.dorojuso }}</span>
                </div>
                <div class="flex">
                  <span class="text-xs font-semibold bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-purple-900 px-2.5 py-0.5 rounded flex items-center justify-center m-0 h-6">지번</span>
                  <span class="text-sm text-black font-normal ml-1">{{ apart.jibunjuso }}</span>
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
      <div v-else></div>
    </div>

    <div style="padding: 2.8em 2em 2em 2em;" v-if="openDetail">
    <SearchDetail/>
    </div>
  </div>
  <!-- 좌측 조작화면 끝 -->
</template>

<style scoped></style>
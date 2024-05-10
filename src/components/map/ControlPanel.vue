<script setup>
import axios from 'axios'
import { useHouseStore } from '@/stores/house';
import { ref, onMounted } from 'vue'
import SearchDetail from './SearchDetail.vue';

const inputName = ref('')
const openDetail = ref(false)
const store = useHouseStore()

const sido = ref([])
const gugun = ref([])
const dong = ref([])
const selectedSido = ref('')
const selectedGugun = ref('')
const selectedDong = ref('')

onMounted(() => {
  // 브라우저가 열리면 시도정보 얻기
  sendRequest(sido, "*00000000");
})

// 숫자 3자리마다 , 붙임
const toNumberFormatOfKor = function(number) {
const store = useHouseStore()

  if (number === undefined) {
    return '정보 없음'; // 또는 적절한 기본값
  }
  number = Number(number);
  return number.toLocaleString('ko-KR');
}


// 아파트 이름으로 검색
const searchByName = () => {
  store.searchByName(inputName.value)
}

// 아파트 거래내역 지역으로 검색
const searchTradeInfoListByDistrict = function() {
  store.searchTradeInfoListByDistrict(selectedDong.value)
}

const showDetails = (aptCode) => {
  store.showDetails(aptCode)
}

// select 아이디와, 지역코드를 가지고 select option의 값을 변경해준다.
const sendRequest = function(selid, regcode) {
  const url = "https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes";
  let params = "regcode_pattern=" + regcode + "&is_ignore_zero=true";
  fetch(`${url}?${params}`)
    .then((response) => response.json())
    .then((data) => {
      return addOption(selid, data)
    });
}

// 선택한 select에 option 을 추가하는 메서드
const addOption = function(selid, data) {
  let opt = ``;
  initOption(selid);

  switch (selid.value.id) {
    case "sido":
      opt += `<option value="">시도 선택</option>`;
      data.regcodes.forEach(function (regcode) {
        opt += `
                <option value="${regcode.code}">${regcode.name}</option>
                `;
      });
      break;
    case "gugun":
      opt += `<option value="">군구 선택</option>`;
      for (let i = 0; i < data.regcodes.length; i++) {
        if (i != data.regcodes.length - 1) {
          if (
            data.regcodes[i].name.split(" ")[1] == data.regcodes[i + 1].name.split(" ")[1] &&
            data.regcodes[i].name.split(" ").length !=
            data.regcodes[i + 1].name.split(" ").length
          ) {
            data.regcodes.splice(i, 1);
            i--;
          }
        }
      }
      let name = "";
      data.regcodes.forEach(function (regcode) {
        if (regcode.name.split(" ").length == 2) name = regcode.name.split(" ")[1];
        else name = regcode.name.split(" ")[1] + " " + regcode.name.split(" ")[2];
        opt += `
                <option value="${regcode.code}">${name}</option>
                `;
      });
      break;
    case "dong":
      opt += `<option value="">읍면동 선택</option>`;
      let idx = 2;
      data.regcodes.forEach(function (regcode) {
        if (regcode.name.split(" ").length != 3) idx = 3;
        opt += `
                <option value="${regcode.code}">${regcode.name.split(" ")[idx]}</option>
                `;
      });
  }
  selid.value.innerHTML = opt;
}

// option 초기화
const initOption = function(selid) {
  let options =  selid.value;
  options.length = 0;
  let opt = ``;

  if(selid.value.id == 'gugun') {
    opt += `<option value="">군구 선택</option>`;
  }
  if(selid.value.id == 'dong') {
    opt += `<option value="">읍면동 선택</option>`;
  }
  selid.value.innerHTML = opt;
}

// 시도가 바뀌면 구군정보 얻기.
const sidoHandleChange = function() {
  selectedGugun.value = ''
  selectedDong.value = ''

  if (selectedSido.value) {
    if(selectedSido.value == '') return;
    let regcode = selectedSido.value.substr(0, 2) + "*00000";
    sendRequest(gugun, regcode);
  } else {
    initOption(gugun);
    initOption(dong);
  }
}

// 구군이 바뀌면 동 정보 얻기
const gugunHandleChange = function() {
  selectedDong.value = ''

  if (selectedGugun.value) {
    let regcode = selectedGugun.value.substr(0, 5) + "*";
    sendRequest(dong, regcode);
  } else {

    initOption(dong);
  }
}

const toggleControlPanel = function() {
  store.openControlPanel = !store.openControlPanel
}
</script>

<template>
  <div style="padding: 2.8em 2em 2em 2em;">
    <div class="left-handle" :class="{'min-h-85': (store.searchResult.length > 0 || store.searchTradingInfoResult.length > 0) && store.openControlPanel}"
    style="display: flex;flex-direction: column;justify-content: space-between;">
      <div>
        <div class="left-handle-menu">
          <ul>
            <li class="list-selected">아파트</li>
          </ul>
        </div>

        <div class="flex input-cont">
          <input type="text" v-model="inputName" id="houseNameSearchForm" class="focus:outline-none flex-grow" style="flex-basis: 80%" placeholder="아파트명을 검색해보세요"/>
          <button class="w-2/10 py-2.5 px-3 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" id="name-search-btn" @click="searchByName">
            검색
          </button>
        </div>

        <div class="left-handle-selector">
          <form id="houseSearchForm" style="display: flex; width: 100%; justify-content: space-around;">
            <select class="custom-selector" id="sido" name="sido" v-model="selectedSido" @change="sidoHandleChange" ref="sido">
              <option value="">시도 선택</option>
            </select>
            <select class="custom-selector" id="gugun" name="gugun" v-model="selectedGugun" @change="gugunHandleChange" ref="gugun">
              <option value="">군구 선택</option>
            </select>
            <select class="custom-selector" id="dong" name="dong" v-model="selectedDong" ref="dong">
              <option value="">읍면동 선택</option>
            </select>
          </form>
        </div>
        <!-- 시도/군구/읍면동 선택 끝 -->

        <div class="mt-3">
          <button @click="searchTradeInfoListByDistrict"
            class="w-full py-2 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            id="list-btn"
            type="button"
          >
            지역 검색
          </button>
        </div>

        <!-- 아파트 정보 조회 결과 -->
        <div class="list-cont mt-5 overflow-y-auto mostly-customized-scrollbar" v-if="store.searchResult.length > 0 && store.openControlPanel">
          <section id="listContSection">
            <article v-for="apart in store.searchResult" :key="apart.aptCode" @click="showDetails(apart.aptCode)" class="block mb-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 p-3 cursor-pointer">
              <div>
                <div class="grid font-semibold text-blue-500 flex flex-wrap items-center gap-1">
                  <div class="flex">
                    <span class="text-xs font-semibold bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-purple-900 px-2.5 py-0.5 rounded flex items-center justify-center m-0 h-6 mr-1">아파트명</span>
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
        <!-- 아파트 정보 조회 결과 끝 -->

        <!-- 아파트 거래내역 정보 조회 결과 -->
        <div class="list-cont mt-5 overflow-y-auto mostly-customized-scrollbar" v-if="store.searchTradingInfoResult.length > 0 && store.openControlPanel">
          <section id="listContSection">
            <article v-for="(tradingInfo, index) in store.searchTradingInfoResult" :key="index" @click="showDetails(tradingInfo.aptCode)">
              <div class="block block mb-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 p-3 cursor-pointer">
                <div class="flex justify-between">
                  <h2 class="max-w-[14rem] font-semibold text-blue-500 flex flex-wrap items-center gap-1">
                    {{tradingInfo.apartmentName}}
                    <span class="text-sm text-black font-normal">
                      {{tradingInfo.floor}}층 {{tradingInfo.exclusiveArea }}평
                    </span>
                  </h2>
                  <div class="flex justify-between">
                    <span class="text-xs font-semibold bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-purple-900 px-2.5 py-0.5 rounded flex items-center justify-center m-0 h-6 m-0 h-6">
                      {{tradingInfo.dealDate}}
                    </span>
                  </div>
                </div>

                <div>
                  <span class="text-xl text-black font-bold">
                    {{toNumberFormatOfKor(tradingInfo.dealAmount)}} 만원
                  </span>
                </div>

              </div>
            </article>
          </section>
        </div>
        <!-- 아파트 거래내역 정보 조회 결과 끝 -->
        <div class="list-cont mt-5 overflow-y-auto mostly-customized-scrollbar text-center" v-if="store.isResultEmpty">
          <span>조회결과 없음</span>
        </div>

      </div>
      <div class="text-center" v-if="(store.searchResult.length > 0) || (store.searchTradingInfoResult.length > 0)">
        <button @click="toggleControlPanel" v-if="store.openControlPanel" style="width: 50px" ><i class="fa-solid fa-chevron-up"></i></button>
        <button @click="toggleControlPanel" v-if="!store.openControlPanel" style="width: 50px" ><i class="fa-solid fa-chevron-down"></i></button>
      </div>
    </div>

    <div v-if="store.openDetail">
    <SearchDetail/>
    </div>
  </div>
  <!-- 좌측 조작화면 끝 -->
</template>

<style scoped></style>
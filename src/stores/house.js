import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'

const REST_HOUSE_API = `http://localhost:8080/house`
// 카카오맵 api key
const KAKAO_MAP_KEY = '892506882ffac8549eb7d9c813805c6e'

// 이름으로 검색시 조회되는 내용
const searchResult = ref([])
// 지역으로 검색시 조회되는 내용
const searchTradingInfoResult = ref([])
// 검색시 정보가 없으면 조회되는 내용이 없다교 표시하는 여부
const isResultEmpty = ref(false)

// 상세정보 창 조회했는지 여부
const openDetail = ref(false)

// 상세 정보 데이터 갱신 여부
const loadDetailData = ref(false)

// 상세정보 창에 표시되는 내용
const detailData = ref([])

// 선택한 옵션 목록
const selectedOptions = ref([])

// 옵션 변수 목록 (음식, 교육, 예술/스포츠, 병원)
const foodCode = 'I2';
const educationCode = 'P1';
const sportsCode = 'R1';
const hospitalCode = 'Q1';

// 상세정보 창 닫기
const closeOpenDetail = () => {
  openDetail.value = !openDetail.value
}


// 위도 경도
const nowLat = ref('')
const nowLng = ref('')

// 좌측 조회 패널 접기 열기 (false가 접혀있는 상태)
const openControlPanel = ref(false)

export const useHouseStore = defineStore('house', () => {

  // 아파트 이름으로 검색
  const searchByName = (name) => {
    // 검색 내역 초기화
    searchResult.value = ''
    searchTradingInfoResult.value = ''

    axios.get(`${REST_HOUSE_API}/list/name/${name}`)
      .then((res) => {
        searchResult.value = res.data
        if(searchResult.value.length < 1) {
          if(openControlPanel.value) {
            openControlPanel.value = false
          }
          isResultEmpty.value = true;
        }
        else{
          isResultEmpty.value = false;
          if(!openControlPanel.value) {
            openControlPanel.value = true;
          }
        }

      })
      .catch((err) => {
        console.error('이름 검색 예외 발생 :: ', err)
      })
  }

  // 아파트 상세 정보 조회
  const showDetails = (aptCode) => {
    axios
      .get(`${REST_HOUSE_API}/detail/${aptCode}`)
      .then((res) => {
        openDetail.value = true;
        detailData.value = res.data;
        nowLat.value = res.data[0].lat;
        nowLng.value = res.data[0].lng;
      })
      .catch((err) => {
        console.error('조회 에러 발생 :: ', err)
      })
  }

  // 지역으로 거래내역 조회
  const searchTradeInfoListByDistrict = (selectedDong) => {
    // 검색 내역 초기화
    searchResult.value = ''
    searchTradingInfoResult.value = ''

    if(selectedDong === '') {
      isResultEmpty.value = true;
    }

    axios.get(`${REST_HOUSE_API}/list/code/${selectedDong}`)
    .then((res) => {
      searchTradingInfoResult.value = res.data
      if(searchTradingInfoResult.value.length < 1) {
        if(openControlPanel.value) {
          openControlPanel.value = false
        }
        isResultEmpty.value = true;
      }
      else{
        isResultEmpty.value = false;
        if(!openControlPanel.value) {
          openControlPanel.value = true;
        }
      }
    })
    .catch((err) => {
      console.error('지역 검색 예외 발생 :: ', err)
    })
  }

  return {
    REST_HOUSE_API, searchResult, searchByName, showDetails, openDetail,
    detailData, nowLat, nowLng, searchTradeInfoListByDistrict, searchTradingInfoResult,
    isResultEmpty, selectedOptions, openControlPanel,closeOpenDetail, foodCode, educationCode, sportsCode,
    hospitalCode
  }
})

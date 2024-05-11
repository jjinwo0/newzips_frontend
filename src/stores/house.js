import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'

const REST_HOUSE_API = `http://localhost:8080/house`

// 이름으로 검색시 조회되는 내용
const searchResult = ref([])
// 지역으로 검색시 조회되는 내용
const searchTradingInfoResult = ref([])
// 검색시 정보가 없으면 조회되는 내용이 없다교 표시하는 여부
const isResultEmpty = ref(false)


// 상세정보 창 조회했는지 여부
const openDetail = ref(false)

// 상세정보 창에 표시되는 내용
const detailData = ref([])

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

  const searchByName = (name) => {
    searchResult.value = ''
    searchTradingInfoResult.value = ''
    axios.get(`http://localhost:8080/house/list/name/${name}`)
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

  const showDetails = (aptCode) => {
    axios
      .get(`http://localhost:8080/house/detail/${aptCode}`)
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

  const searchTradeInfoListByDistrict = (selectedDong) => {
    searchResult.value = ''
    searchTradingInfoResult.value = ''

    if(selectedDong === '') {
      isResultEmpty.value = true;
    }

    axios.get(`http://localhost:8080/house/list/code/${selectedDong}`)
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
    isResultEmpty, openControlPanel,closeOpenDetail
  }
})

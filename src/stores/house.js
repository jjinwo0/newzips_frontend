import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'

const REST_HOUSE_API = `http://localhost:8080/house`

const searchResult = ref([])

const openDetail = ref(false)

const detailData = ref([])

const nowLat = ref('')
const nowLng = ref('')

export const useHouseStore = defineStore('house', () => {

  const searchByName = (name) => {
    axios.get(`http://localhost:8080/house/list/name/${name}`)
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
        detailData.value = res.data;
        nowLat.value = res.data[0].lat;
        nowLng.value = res.data[0].lng;
      })
      .catch((err) => {
        console.error('조회 에러 발생 :: ', err)
      })
  }

  return {
    REST_HOUSE_API, searchResult, searchByName, showDetails, openDetail, detailData, nowLat, nowLng
  }
})

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import axios from 'axios'
import ControlPanel from '@/components/map/ControlPanel.vue'
import { useHouseStore } from '@/stores/house'
import { KakaoMap, KakaoMapCustomOverlay  } from 'vue3-kakao-maps';
import StoreOptionPanel from '@/components/map/StoreOptionPanel.vue'

const store = useHouseStore()
const map = ref(null)

// 카카오맵 주소-좌표 변환 객체
var geocoder = null;

// 행정동 주소를 담는 객체
var address = ref({
  sidoName : '',
  gugunName : '',
  dongName : ''
})

// 옵션 정보를 담는 배열
var selectedOptions = computed( () => {
  return [...store.selectedOptions]
})

// 마커 정보를 담는 객체
let markers = ref([]);

// 상가 정보를 담는 객체
let storeMarkers = ref([]);

onMounted(() => {
  fetchUserLocation()
})

watch([() => store.nowLat, () => store.nowLng], ([lat, lng], [oldLat, oldLng]) => {
  if(map.value && lat && lng){
    const moveLatLng = new kakao.maps.LatLng(lat, lng);
    map.value.panTo(moveLatLng);
  }
}, { immediate: true });

// ip 주소를 바탕으로 유저의 현재 위도 경도를 받아온다.
async function fetchUserLocation() {
  const { data } = await axios.get('https://ipinfo.io?token=3f6d40d101ffd6')
  const [latitude, longitude] = data.loc.split(',')

  store.nowLat = latitude
  store.nowLng = longitude

}

const onLoadKakaoMap = (mapRef) => {

  // 주소-좌표 변환 객체를 생성합니다
  geocoder = new kakao.maps.services.Geocoder();

  map.value = mapRef;
  kakao.maps.event.addListener(map.value, 'idle', function() {
    searchAddrFromCoords(map.value.getCenter(), getApartMentInfoByDongName);
  })

};

function searchAddrFromCoords(coords, callback) {
  // 좌표로 행정동 주소 정보를 요청합니다
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 지도 중심좌표에 대한 주소정보를 바탕으로 아파트 정보를 가져오는 함수
function getApartMentInfoByDongName(result, status) {
  if (status === kakao.maps.services.Status.OK) {

    for(var i = 0; i < result.length; i++) {
      // 행정동의 region_type 값은 'H' 이므로
      if (result[i].region_type === 'H') {
        let addressName = result[i].address_name;
        [address.value.sidoName, address.value.gugunName, address.value.dongName] = addressName.split(' ');

        axios.get(`${store.REST_HOUSE_API}/list/apart`, {
          params: address.value
        })
        .then((response) => {
          markers.value = response.data.map((markerInfo) => ({
              aptCode : markerInfo.aptCode,
              dealAmount : markerInfo.dealAmount,
              nowLat : markerInfo.lat,
              nowLng : markerInfo.lng,
              apartmentName: markerInfo.apartmentName
          }))
        })
        .catch((error) => {
          console.log(error)
        })

        let params = {...address.value, 'selectedOption' : selectedOptions.value.join(",")};
        console.log('======================')
        console.log(params)

        //상권정보 가져오는 api
        axios.get(`http://localhost:8080/store/list`, {
          params: params
        })
        .then((response) => {
          storeMarkers.value = [];

          for(var markerInfo of response.data) {
            storeMarkers.value.push({
              storeName : markerInfo.storeName,
              mainCategoryName : markerInfo.mainCategoryName,
              doro: markerInfo.doro,
              nowLat : markerInfo.lat,
              nowLng : markerInfo.lng
            })
          }

          console.log('상권정보 ==== ' + storeMarkers.value)
        })
        .catch((error) => {
          console.log(error)
        })

        break;
      }
    }
  }
}

const shortenWords = (str, length = 8) => {
  let result = '';
  if(str.length > length) {
    result = str.slice(0, length-3) + '...';
  }
  else {
    result = str;
  }
  return result
}

// 커스텀 오버레이 설정
const content = (aptCode, dealAmount, apartmentName) =>{
  let html = `<div class="house-info-overlay" onclick="showDetails(${aptCode})">
        <div class="apart-amount">${dealAmount}억</div>
        <p class="apart-name" style="">`
          + shortenWords(apartmentName, 10) +
        `</p></div>`;
  return html;
}

// 해당 아파트에 대한 상세 정보를 보여주는 전역 메서드
window.showDetails = function(aptCode) {
  showDetails(aptCode)
}

// 아파트상세 정보 조회 뷰 메서드
const showDetails = (aptCode) => {
  store.showDetails(aptCode)
}



</script>

<template>


  <KakaoMap :lat="store.nowLat" :lng="store.nowLng" :draggable="true" style="height: 100vh; width: 100%" @onLoadKakaoMap="onLoadKakaoMap">
    <template v-for="marker in markers">
      <KakaoMapCustomOverlay  :lat="marker.nowLat" :lng="marker.nowLng" :content="content(marker.aptCode, marker.dealAmount, marker.apartmentName)">

      </KakaoMapCustomOverlay>
    </template>

    <StoreOptionPanel />
    <ControlPanel />
  </KakaoMap>

</template>

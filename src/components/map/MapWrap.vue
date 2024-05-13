<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import ControlPanel from '@/components/map/ControlPanel.vue'
import { useHouseStore } from '@/stores/house'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

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

// 마커 정보를 담는 객체
let makers = ref([]);

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
            console.log(response)
            console.log("=====================" + response.data)
            makers.value = [];

            for(var markerInfo of response.data) {
              makers.value.push({
                title : markerInfo.apartmentName,
                nowLat : markerInfo.lat,
                nowLng : markerInfo.lng
              })
            }



          })
          .catch((error) => {
            console.log(error)
          })

        break;
      }
    }
  }
}



// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
// kakao.maps.event.addListener(map, 'idle', function() {
//   console.log('dd')
//   //searchAddrFromCoords(map.getCenter(), displayCenterInfo);
// });


</script>

<template>


  <KakaoMap :lat="store.nowLat" :lng="store.nowLng" :draggable="true" style="height: 100vh; width: 100%" @onLoadKakaoMap="onLoadKakaoMap">
    <KakaoMapMarker v-for="maker in makers" :lat="maker.nowLat" :lng="maker.nowLng"></KakaoMapMarker>
    <ControlPanel />
  </KakaoMap>

</template>

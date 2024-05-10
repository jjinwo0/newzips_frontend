<template>
  <div ref="map" class="max-w-full h-screen">
    <ControlPanel />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import ControlPanel from '@/components/map/ControlPanel.vue'
import { useHouseStore } from '@/stores/house'

const store = useHouseStore()

const map = ref(null)
let currentMarker = null; // 현재 마커를 저장하기 위한 변수

onMounted(() => {
  fetchUserLocation()
})

async function fetchUserLocation() {
  try {
    const { data } = await axios.get('https://ipinfo.io?token=3f6d40d101ffd6')
    const [latitude, longitude] = data.loc.split(',')

    store.nowLat = latitude
    store.nowLng = longitude

    initMap(parseFloat(store.nowLat), parseFloat(store.nowLng))
  } catch (error) {
    console.error('위치 정보를 가져오는데 실패했습니다.', error)
    initMap(33.450701, 126.570667)
  }
}

function initMap(latitude, longitude) {
  if (window.kakao && window.kakao.maps) {
    const container = map.value
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3
    }

    map.value = new kakao.maps.Map(container, options)
  } else {
    const script = document.createElement('script')
    script.onload = () => {
      kakao.maps.load(() => {
        const container = map.value
        const options = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 3
        }

        map.value = new kakao.maps.Map(container, options)
      })
    }
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=892506882ffac8549eb7d9c813805c6e'
    document.head.appendChild(script)
  }
}

watch([() => store.nowLat, () => store.nowLng], ([lat, lng], [oldLat, oldLng]) => {
  if(map.value && lat && lng){
    const moveLatLng = new kakao.maps.LatLng(lat, lng);
    map.value.panTo(moveLatLng);

    // 마커 이미지 URL
    const markerImageUrl = '../../src/assets/pin-icon.png';
    const imageSize = new kakao.maps.Size(64, 69);
    const imageOption = {offset: new kakao.maps.Point(27, 69)};

    const markerImage = new kakao.maps.MarkerImage(markerImageUrl, imageSize, imageOption);

    const markerPosition  = new kakao.maps.LatLng(lat, lng);

    if (currentMarker !== null) {
      currentMarker.setMap(null); // 기존 마커가 있다면 지도에서 제거
    }

    currentMarker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage
    });

    currentMarker.setMap(map.value);
  }
}, { immediate: true });
</script>

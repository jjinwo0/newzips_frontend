<template>
  <div ref="map" class="container max-w-full h-screen">
    <ControlPanel />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import ControlPanel from '@/components/map/ControlPanel.vue' // axios를 사용하여 HTTP 요청을 보냅니다.
import { useHouseStore } from '@/stores/house'

const store = useHouseStore()

const map = ref(null)

const marker = ref(null)

onMounted(() => {
  fetchUserLocation()
})

async function fetchUserLocation() {
  try {
    // ipinfo.io에서 위치 정보를 가져옵니다. (여기서는 무료 토큰이 필요합니다)
    const { data } = await axios.get('https://ipinfo.io?token=3f6d40d101ffd6')
    const [latitude, longitude] = data.loc.split(',')

    store.nowLat = latitude
    store.nowLng = longitude

    initMap(parseFloat(store.nowLat), parseFloat(store.nowLng))
  } catch (error) {
    console.error('위치 정보를 가져오는데 실패했습니다.', error)
    // 오류가 발생하면 기본 위치를 사용합니다.
    initMap(33.450701, 126.570667)
  }
}

function initMap(latitude, longitude) {
  if (window.kakao && window.kakao.maps) {
    const container = map.value // ref를 사용하여 DOM 요소에 접근
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3
    }

    // map ref에 지도 인스턴스를 할당
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
      '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=892506882ffac8549eb7d9c813805c6e' // 여기서 YOUR_APP_KEY 부분을 실제 앱 키로 교체해주세요.
    document.head.appendChild(script)
  }
}

watch([() => store.nowLat, () => store.nowLng], ([lat, lng]) => {
  if(map.value && lat && lng){
    const moveLatLng = new kakao.maps.LatLng(lat, lng);
    map.value.panTo(moveLatLng);

    if (marker.value) {
      marker.value.setPosition(moveLatLng)
    }
  }
}, { immediate: true });
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useHouseStore } from '@/stores/house'

const props = defineProps({
  lat : [Number, String],
  lng : [Number, String]
})

const store = useHouseStore()
const roadViewRef = ref(null)

watch(
  () => [props.lat, props.lng],
  () => {
    updateRoadView();
  }
);

onMounted( () => {
  updateRoadView()
})

const updateRoadView = () => {
  var roadviewContainer = roadViewRef.value //로드뷰를 표시할 div
  var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
  var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

  var position = new kakao.maps.LatLng(props.lat, props.lng);
// 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
  roadviewClient.getNearestPanoId(position, 50, function(panoId) {
    roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
  });
};



</script>

<template>
  <div ref="roadViewRef" style="width:100%;height:300px;"></div>
</template>

<style scoped>

</style>
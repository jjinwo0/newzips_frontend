<script setup>
import { useHouseStore } from '@/stores/house';
import { ref, onMounted } from 'vue';
import RoadView from '@/components/map/RoadView.vue'

const store = useHouseStore()

//  아파트 실거래가 정보
const detail = ref(store.detailData);
detail.value.reverse()

const dealChartRef = ref(null)

onMounted( () => {
  console.log(detail)
  if(dealChartRef.value) {
    const ctx = dealChartRef.value.getContext('2d');
    dealChartRef.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: detail.value.map(item => {
          const year = item.dealYear; // 년도 추출
          const monthDay = item.dealMonth + '/' + item.dealDay; // 월/일 형식으로 변환
          return year + '/' + monthDay; // 라벨 형식: dealYear/dealDate
        }),
        datasets: [{
          label: '거래 금액',
          data: detail.value.map(item => parseFloat(item.dealAmount.replace(/,/g, ''))),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

})



</script>

<template>
    <div class="left-handle overflow-y-auto mostly-customized-scrollbar" style="height: 86vh">

        <div class="left-handle-menu">
          <div class="float-right">
            <button class="btn-close text-xl" @click="store.closeOpenDetail"><i class="fa-solid fa-x"></i></button>
          </div>
          <div class="text-2xl ">
            <div>{{ detail[0].apartmentName }}</div>
          </div>

          <div class="mt-6">
            <RoadView :lat="detail[0].lat" :lng="detail[0].lng"/>
          </div>

          <div class="mt-6 info-box text-sm ">
            <dl>
            <dd>도로명 주소 :</dd>
            <dt>{{ detail[0].dorojuso }}</dt>

            <dd>건축년도 :</dd>
            <dt>{{ detail[0].buildYear }} 년</dt>
            </dl>
          </div>

          <div class="mt-6">
            <p class="text-base">실거래가 변동 추이 (만원) </p>
            <canvas ref="dealChartRef" width="400" height="400"></canvas>
          </div>
        </div>
    </div>
</template>

<style scoped>

</style>
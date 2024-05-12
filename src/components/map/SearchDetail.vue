<script setup>
import { useHouseStore } from '@/stores/house';
import { ref, onMounted } from 'vue';

const store = useHouseStore()

//  아파트 실거래가 정보
const detail = ref(store.detailData);
detail.value.reverse()

const dealChartRef = ref(null)

onMounted( () => {
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
          label: '거래 금액 변동',
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
    <div class="left-handle" style="height: 86vh">

        <div class="left-handle-menu">
          <div class="float-right">
            <button class="btn-close text-xl" @click="store.closeOpenDetail"><i class="fa-solid fa-x"></i></button>
          </div>
          <div class="text-2xl ">
            <div>{{ detail[0].apartmentName }}</div>

          </div>
          <div>
            <p class="text-base">최근 거래 내역</p>
            <canvas ref="dealChartRef" width="400" height="400"></canvas>
          </div>
        </div>
    </div>
</template>

<style scoped>

</style>
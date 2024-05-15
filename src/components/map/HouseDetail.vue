<script setup>
import { useHouseStore } from '@/stores/house';
import { ref, onMounted, watch, computed, nextTick, onUpdated } from 'vue'
import RoadView from '@/components/map/RoadView.vue'
import { AgGridVue } from 'ag-grid-vue3';

const store = useHouseStore()

//  아파트 실거래가 정보
const detailOrg = computed(() => store.detailData);
// const detail = [...detailOrg.value].reverse()
const detail = computed(() => {
  return [...detailOrg.value].reverse();
});

const dealChartRef = ref(null)
const chartInstance = ref(null)
let isAnimating = false;

const rowData = computed(() => detailOrg.value);

// Column Definitions: Defines the columns to be displayed.
const colDefs = [
  { field: 'dealDate', headerName: '거래일', flex: 3 },
  { field: 'floor', headerName: '층', flex: 1 },
  { field: 'exclusiveArea', headerName: '평', flex: 1 },
  { field: 'dealAmount', headerName: '거래금액', flex: 2 }
]

watch( ()=> detailOrg, async (newValue, oldValue) => {
  await nextTick();
  console.log('DOM updated.');

  console.log('Chart data changed:');
  if (!isAnimating) {
    await loadDetailData();
  } else {
    console.log('Chart is animating, waiting for completion...');
    const interval = setInterval(() => {
      if (!isAnimating) {
        clearInterval(interval);
        loadDetailData();
      }
    }, 100); // Check every 100ms if animation is complete
  }

}, {deep:true})

const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(store.detailData);
    }, 1000)
  })
}

const loadDetailData = async () => {
  if(dealChartRef.value) {
      chartRendering()
  }
  else {
    console.warn('dealChartRef is null');
  }
}

const chartRendering = async function() {
  await nextTick()
  // 기존 차트가 존재하는 경우 제거
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  isAnimating = true;
  const ctx = dealChartRef.value.getContext('2d');
  console.log(ctx)
  chartInstance.value = new Chart(ctx, {
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
      },
      animation: {
        onComplete: () => {
          isAnimating = false;
        }
      }
    }
  });
  console.log(chartInstance.value)
}

onMounted( async () => {
  loadDetailData()

})

onUpdated(() => {



});




const agGridDefaults = {
  option: {
    pagination: true,
    paginationPageSize : 10,
    defaultColDef: { headerClass: "centered", cellClass: "centered" }, // 여기
  },
  gridApi: null
}

// ag-grid 데이터 컬럼의 넓이를 촘촘하게 하는 메서드
const onReady = (params) => {
  params.api.sizeColumnsToFit()
}



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

          <div class="mt-6 custom-ag-grid" style="width: 100%;">
            <ag-grid-vue
              :rowData="rowData"
              :columnDefs="colDefs"
              style="height: 519px"
              class="ag-theme-quartz"
              @grid-ready="onReady"
              :grid-options="agGridDefaults.option"
            >
            </ag-grid-vue>
          </div>


        </div>
    </div>
</template>

<style scoped>

</style>
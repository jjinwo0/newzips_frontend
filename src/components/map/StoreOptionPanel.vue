<script setup>

import { ref } from 'vue'
import { useHouseStore } from '@/stores/house'

const store = useHouseStore()

const foodSelected = ref(false)
const pencilSelected = ref(false)
const gymSelected = ref(false)
const hospitalSelected = ref(false)



const toggleFoodSelected = () => {
  foodSelected.value = !foodSelected.value
  pushOptionCode(foodSelected.value, store.foodCode)
}

const togglePencilSelected = () => {
  pencilSelected.value = !pencilSelected.value
  pushOptionCode(pencilSelected.value, store.educationCode)
}

const toggleGymSelected = () => {
  gymSelected.value = !gymSelected.value
  pushOptionCode(gymSelected.value, store.sportsCode)
}

const toggleHospitalSelected = () => {
  hospitalSelected.value = !hospitalSelected.value
  pushOptionCode(hospitalSelected.value, store.hospitalCode)
}

// 선택 여부에 따른 옵션 코드 추가 함수
let pushOptionCode = (isSelected, optionCode) => {
  if(isSelected) {
    if(!store.selectedOptions.includes(optionCode)) {
      store.selectedOptions.push(optionCode);
    }
  } else {
    store.selectedOptions = store.selectedOptions.filter(option => option !== optionCode);
  }
}

</script>

<template>
<div class="store-option-panel">
  <div class="store-option">
    <button @click="toggleFoodSelected" :class="{'btn-food-option-selected' : foodSelected}" class="btn-option-select">
      <i class="fa-solid fa-utensils"></i>
    </button>

    <button @click="togglePencilSelected" :class="{'btn-pencil-option-selected' : pencilSelected}" class="btn-option-select">
      <i class="fa-solid fa-pencil"></i>
    </button>

    <button @click="toggleGymSelected" :class="{'btn-gym-option-selected' : gymSelected}" class="btn-option-select">
      <i class="fa-solid fa-dumbbell"></i>
    </button>

    <button @click="toggleHospitalSelected" :class="{'btn-hospital-option-selected' : hospitalSelected}" class="btn-option-select">
      <i class="fa-solid fa-hospital"></i>
    </button>
  </div>

</div>
</template>

<style scoped>

</style>
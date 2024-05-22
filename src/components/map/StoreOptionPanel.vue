<script setup>
import { ref } from 'vue';
import { useHouseStore } from '@/stores/house';
import ChatGptComponent from '../common/ChatGptComponent.vue';

const store = useHouseStore();

const foodSelected = ref(false);
const pencilSelected = ref(false);
const gymSelected = ref(false);
const hospitalSelected = ref(false);

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  const modalContent = document.querySelector('.modal-content');
  modalContent.style.animation = 'slideOutToRight 0.5s ease-out forwards, fadeOut 0.5s ease-out forwards';

  setTimeout(() => {
    showModal.value = false;
  }, 500); // 0.5초 후에 showModal 값을 false로 설정
};

const toggleFoodSelected = () => {
  foodSelected.value = !foodSelected.value;
  pushOptionCode(foodSelected.value, store.foodCode);
};

const togglePencilSelected = () => {
  pencilSelected.value = !pencilSelected.value;
  pushOptionCode(pencilSelected.value, store.educationCode);
};

const toggleGymSelected = () => {
  gymSelected.value = !gymSelected.value;
  pushOptionCode(gymSelected.value, store.sportsCode);
};

const toggleHospitalSelected = () => {
  hospitalSelected.value = !hospitalSelected.value;
  pushOptionCode(hospitalSelected.value, store.hospitalCode);
};

// 선택 여부에 따른 옵션 코드 추가 함수
const pushOptionCode = (isSelected, optionCode) => {
  if (isSelected) {
    if (!store.selectedOptions.includes(optionCode)) {
      store.selectedOptions.push(optionCode);
    }
  } else {
    store.selectedOptions = store.selectedOptions.filter(option => option !== optionCode);
  }
};
</script>

<template>
  <div class="store-option-panel">
    <div class="store-option option-step">
      <button @click="toggleFoodSelected" :class="{'btn-food-option-selected' : foodSelected}" class="btn-option-select option-step">
        <i class="fa-solid fa-utensils"></i>
      </button>

      <button @click="togglePencilSelected" :class="{'btn-pencil-option-selected' : pencilSelected}" class="btn-option-select option-step">
        <i class="fa-solid fa-pencil"></i>
      </button>

      <button @click="toggleGymSelected" :class="{'btn-gym-option-selected' : gymSelected}" class="btn-option-select option-step">
        <i class="fa-solid fa-dumbbell"></i>
      </button>

      <button @click="toggleHospitalSelected" :class="{'btn-hospital-option-selected' : hospitalSelected}" class="btn-option-select option-step">
        <i class="fa-solid fa-hospital"></i>
      </button>

      <!-- 모달을 띄우는 버튼 -->
      <button @click="openModal" class="btn-option-select option-step">
        <i class="fa-solid fa-comments"></i>
      </button>

      
      <div v-if="showModal" class="modal">
        <div class="modal-content" @click.self="showModal = false">
          <ChatGptComponent @closeModal="closeModal"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.button-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

/* 모달 오버레이 스타일 */
.modal-overlay {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 모달을 왼쪽에 정렬 */
  justify-content: center;
  padding-left: 10%; /* 왼쪽 정렬 시 여백 조정 */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end; /* 모달을 오른쪽에서 왼쪽으로 배치 */
  align-items: center;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(20%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideOutToRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(20%);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}


.modal-content {
  position: fixed; /* 위치 고정 방식을 fixed로 변경 */
  bottom: 51.5%; /* 아랫변의 위치를 화면 하단으로부터 90px 떨어진 곳으로 설정 */
  top: auto; /* 상단 위치를 자동으로 조절하여 내용이 늘어날 때 위로 확장되도록 설정 */
  margin-right: 120px; /* 오른쪽 여백 설정 유지 */
  max-height: 80%; /* 모달의 최대 높이 설정 유지 */
  overflow-y: auto; /* 내용이 넘치면 스크롤 생성 */
  background: #fff;
  width: 620px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  animation: slideInFromRight 0.5s ease-out forwards, fadeIn 0.5s ease-out forwards;
}

/* Prevent the modal area from being closed by clicking outside */
.modal-content, .modal-overlay {
  cursor: default;
}

.open-modal-button, .close-modal-button {
  cursor: pointer;
}

.close-modal-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
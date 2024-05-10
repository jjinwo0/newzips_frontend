import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import axios from 'axios'

const REST_HOUSE_API = `http://localhost:8080/house`

export const useHouseStore = defineStore('hosue', () => {
// Pinia 기능을 완성해봅시다.


  return {
    REST_HOUSE_API
  }
})

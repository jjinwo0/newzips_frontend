import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useKakao } from 'vue3-kakao-maps/@utils';

/* ag-grid css */
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import './assets/main.css';

const pinia = createPinia()
const app = createApp(App)

useKakao('892506882ffac8549eb7d9c813805c6e', ['services']);
app.use(pinia)
app.use(router)

app.mount('#app')

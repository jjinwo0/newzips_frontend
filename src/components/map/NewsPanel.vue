<script setup lang="ts">

import { ref, onMounted } from 'vue'
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';

const news = ref([])
onMounted( () => {
  axios.get(`http://localhost:8080/news/related`)
    .then((res) => {
      news.value = res.data
    })
    .catch((e) => {
      console.log(e)
    })
})

const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log('slide change');
};

const shortenWords = (str, length = 24) => {
  let result = '';
  if(str.length > length) {
    result = str.slice(0, length-3) + '...';
  }
  else {
    result = str;
  }
  return result
}

</script>

<template>
  <div class="news-panel">
    <div class="new-contents text-sm">
      <div>당일 부동산 뉴스</div>

      <swiper
        :modules = "[Autoplay]"
        :slides-per-view="1"
        :space-between="0"
        :autoplay ="{delay : 3000}"
        navigation
        :pagination="{ clickable: true }"
        @swiper="onSwiper"
        @slideChange="onSlideChange">

        <swiper-slide v-for="(item, index) in news" :key="index" >
          <a :href="item.newsLink" target="_blank">{{ shortenWords(item.newsTitle) }}</a>
        </swiper-slide>
      </swiper>

    </div>
  </div>

</template>

<style scoped>
.swiper-slide {
  color: #3b82f6;
}

.swiper-slide:hover {
  color: #7f7f7f;
}
</style>
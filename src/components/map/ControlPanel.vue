<script setup>

</script>

<template>

    <div style="padding: 2.8em 2em 2em 2em;">
      <div class="left-handle mt-4">
        <div class="left-handle-menu">
          <ul>
            <li class="list-selected">아파트</li>
          </ul>
        </div>

        <div class="flex input-cont">
          <input type="text" id="houseNameSearchForm" class="focus:outline-none flex-grow" style="flex-basis: 80%;" placeholder="아파트명을 검색해보세요" />
          <button class="w-2/10 py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  id="name-search-btn">검색</button>
        </div>

        <div class="left-handle-selector">
          <form id="houseSearchForm">
            <select class="custom-selector" id="sido" name="sido">
              <option value="none">시도 선택</option>
            </select>
            <select class="custom-selector" id="gugun" name="gugun">
              <option value="none">시군구 선택</option>
            </select>
            <select class="custom-selector" id="dong" name="dong">
              <option value="none">읍면동 선택</option>
            </select>
          </form>
        </div>
        <!-- 시도/군구/읍면동 선택 끝 -->


        <div class="mt-5">
          <button class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  id="list-btn" type="button">
            검색
          </button>
        </div>

        <div class="list-cont mt-5 overflow-y-auto mostly-customized-scrollbar">
          <section id="listContSection">

          </section>
        </div>
      </div>

      <div id="detailsContainer" class="left-handle mt-4 close fade-in-out">
        <button id="BtnDetailsContainer" onclick="hideDetailsContainer()">X</button>
      </div>

    </div>
    <!-- 좌측 조작화면 끝 -->
</template>

<style scoped>

</style>
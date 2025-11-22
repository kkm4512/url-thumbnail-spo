<template>
  <div>

    <!-- 🔥 로딩 오버레이 -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
             flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <!-- 스피너 -->
        <div
          class="w-14 h-14 md:w-20 md:h-20 border-4 border-white border-t-transparent
                 rounded-full animate-spin"
        ></div>

        <!-- 로딩 메시지 -->
        <p class="text-white text-lg md:text-2xl mt-6">
          생성 중입니다...
        </p>
      </div>
    </div>

    <!-- 헤더 -->
    <header
      class="w-full bg-blue-600 text-white py-10 shadow-xl flex flex-col items-center justify-center"
    >
      <p class="text-center text-2xl md:text-4xl font-bold px-6 max-w-4xl">
        인스타그램 URL 썸네일 생성 사이트
      </p>
      <p class="mt-2 text-sm md:text-base opacity-90 px-4 text-center">
        썸네일이 보이게 하고 싶은 인스타그램 URL을 생성기에 입력해주세요.
      </p>
    </header>

    <!-- 섹션 1 : 이미지 비교 -->
    <section class="min-h-[45vh] bg-white flex justify-center py-12">
      <div
        class="flex flex-col md:flex-row justify-center items-center md:items-start
               w-full max-w-6xl px-6 md:px-10 gap-16 md:gap-x-40"
      >
        <!-- img1 -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/img1.png"
            class="w-60 md:w-80 rounded-xl shadow-md"
          />
          <p class="text-red-500 text-lg font-bold mt-4 md:translate-y-10">
            흠.. 썸네일이 없어서 별로 안궁금해 보이네
          </p>
        </div>

        <!-- img2 -->
        <div class="flex flex-col items-center md:items-end text-center md:text-right">
          <img
            src="/img2.png"
            class="w-60 md:w-80 rounded-xl shadow-md"
          />
          <p class="text-red-500 text-lg font-bold mt-4 md:mt-6 md:mr-16">
            아 ㅋㅋㅋㅋ 개쌉궁금
          </p>
        </div>
      </div>
    </section>

    <!-- 섹션 2 : 생성기 + 결과 박스 -->
    <section class="min-h-[55vh] bg-gray-100 flex justify-center py-16">
      <div
        class="flex flex-col md:flex-row gap-10 items-center md:items-start 
               justify-center w-full max-w-6xl px-6"
      >
        <div class="-mt-4 md:mt-0 w-full md:w-auto">
          <!-- loading 이벤트 수신 추가됨 -->
          <UrlConverter 
            @converted="onConverted"
            @loading="loading = $event"
          />
        </div>

        <div class="w-full md:w-auto">
          <ResultBox :url="outputUrl" :thumbnail="thumbnailUrl" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from "vue"
import UrlConverter from "~/components/UrlConverter.vue"
import ResultBox from "~/components/ResultBox.vue"

const loading = ref(false)

const outputUrl = ref("")
const thumbnailUrl = ref("")

const onConverted = (data) => {
  loading.value = false // 응답 도착 → 로딩 종료

  outputUrl.value = ""
  thumbnailUrl.value = ""

  setTimeout(() => {
    outputUrl.value = data.previewUrl
    thumbnailUrl.value = data.thumbnail
  }, 10)
}
</script>

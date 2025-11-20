<template>
  <div>

    <!-- 헤더 -->
    <header class="w-full bg-blue-600 text-white py-10 shadow-xl flex flex-col items-center justify-center">
      <p class="text-center text-2xl md:text-4xl font-bold px-6 max-w-4xl">
        인스타그램 URL 썸네일 생성 사이트
      </p>
      <p class="mt-2 text-sm md:text-base opacity-90 px-4 text-center">
        썸네일이 보이게 하고 싶은 인스타그램 URL을 생성기에 입력해주세요.
      </p>
    </header>


    <section class="min-h-[45vh] bg-white flex items-center justify-center py-12">

      <div class="flex flex-row justify-center items-start w-full max-w-6xl px-10 gap-x-40">
        
        <!-- img1 (왼쪽) -->
        <div class="flex flex-col items-start">
          <img
            src="/img1.png"
            class="w-72 md:w-80 rounded-xl shadow-md translate-y-29"
          />
          <p class="text-red-500 text-lg font-bold translate-y-39">
            흠.. 썸네일이 없어서 별로 안궁금해 보이네
          </p>
        </div>

        <!-- img2 (오른쪽) -->
        <div class="flex flex-col items-end">
          <img
            src="/img2.png"
            class="w-72 md:w-80 rounded-xl shadow-md translate-y-4"
          />
          <p class="text-red-500 text-lg mt-6 mr-16 font-bold">
            아 ㅋㅋㅋㅋ 개쌉궁금
          </p>
        </div>

      </div>

    </section>




    <!-- 🩶 하단 — 흰색보다 약간 어두운 영역 -->
    <section class="min-h-[55vh] bg-gray-100 flex items-start justify-center py-16">

      <div class="flex flex-col md:flex-row gap-10 items-center justify-center w-full max-w-6xl px-6">

        <!-- 유저 총 변환수 ← 왼쪽으로 이동 -->
        <div class="flex items-center">
          <ConvertCounter :count="convertCount" />
        </div>

        <!-- 썸네일 생성기 (조금 위로 올림) -->
        <div class="-mt-4">
          <UrlConverter @converted="onConverted" />
        </div>

        <!-- ResultBox -->
        <ResultBox :url="outputUrl" :thumbnail="thumbnailUrl" />

      </div>

    </section>


  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import UrlConverter from "~/components/UrlConverter.vue"
import ResultBox from "~/components/ResultBox.vue"
import ConvertCounter from "~/components/ConvertCounter.vue"

const outputUrl = ref("")
const thumbnailUrl = ref("")
const convertCount = ref(0)

const loadCount = async () => {
  const res = await $fetch("/api/count")
  convertCount.value = res.count
}

onMounted(loadCount)

const onConverted = async (data) => {
  outputUrl.value = data.previewUrl
  thumbnailUrl.value = data.thumbnail

  await $fetch("/api/increase-count", { method: "POST" })
  await loadCount()
}
</script>

<template>
  <div
    class="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border
           transition-all duration-300 relative"
  >
    <p class="text-lg font-semibold text-gray-800 mb-3">생성된 URL</p>

    <!-- 🔥 버튼 정렬 깨짐 해결: items-center 추가 -->
    <div class="flex items-center gap-3">
      <input
        :value="url"
        readonly
        class="flex-1 p-3 border rounded-lg bg-gray-50 text-gray-700"
      />
      <button
        @click="copy"
        class="px-5 py-3 bg-blue-600 text-white rounded-xl shadow
              hover:bg-blue-700 active:scale-95 transition
              whitespace-nowrap min-w-[60px]"
      >
        복사
      </button>

    </div>

    <!-- 🔥 토스트 메시지 -->
    <div
      v-if="showToast"
      class="absolute bottom-4 left-1/2 -translate-x-1/2
             bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg
             opacity-90 animate-fade"
    >
      복사가 완료되었습니다!
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  url: String
})

const showToast = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(props.url)

  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 1000)
}
</script>

<style>
/* 🔥 fade 애니메이션 */
@keyframes fadeInOut {
  0%   { opacity: 0; transform: translate(-50%, 10px); }
  10%  { opacity: 1; transform: translate(-50%, 0); }
  90%  { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 10px); }
}

.animate-fade {
  animation: fadeInOut 1s ease forwards;
}
</style>

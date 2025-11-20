<template>
  <div
    v-if="url"
    class="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border
           transition-all duration-300"
  >
    <p class="text-lg font-semibold text-gray-800 mb-3">생성된 URL</p>

    <div class="flex gap-3">
      <input
        :value="url"
        readonly
        class="flex-1 p-3 border rounded-lg bg-gray-50 text-gray-700"
      />

      <button
        @click="copy"
        class="px-5 py-3 bg-blue-600 text-white rounded-xl shadow
               hover:bg-blue-700 active:scale-95 transition"
      >
        복사
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  url: String
})

const copy = async () => {
  await navigator.clipboard.writeText(props.url)
  alert("URL이 복사되었습니다!")
}
</script>

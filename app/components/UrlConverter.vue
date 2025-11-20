<template>
  <div class="bg-white shadow-xl rounded-xl p-6 w-full max-w-md border-2 border-black">

    <h1 class="text-2xl font-bold text-center mb-5">썸네일 생성기</h1>

    <input
      v-model="inputUrl"
      type="text"
      placeholder="Instagram URL을 입력하세요"
      class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />

    <button
      @click="convertUrl"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-3 rounded-lg mt-4 transition active:scale-[0.98]"
    >
      썸네일 생성
    </button>

    <div v-if="errorMsg" class="mt-3 p-3 bg-red-200 text-red-900 rounded-lg text-sm">
      {{ errorMsg }}
    </div>

  </div>
</template>


<script setup>
import { ref } from "vue"

const inputUrl = ref("")
const errorMsg = ref("")

const emit = defineEmits(["converted"])

const convertUrl = async () => {
  if (!inputUrl.value) {
    errorMsg.value = "URL을 입력해주세요."
    return
  }

  errorMsg.value = ""

  try {
    const res = await $fetch("/api/convert", {
      method: "POST",
      body: { url: inputUrl.value }
    })

    if (res.error) {
      errorMsg.value = res.error
      return
    }

    emit("converted", {
      previewUrl: res.previewUrl,
      thumbnail: res.thumbnail
    })
  } catch (e) {
    console.error(e)
    errorMsg.value = "처리 중 오류 발생"
  }
}
</script>

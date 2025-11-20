<template>
  <div class="bg-white shadow-md rounded-lg px-6 py-5 min-w-[150px] flex flex-col  border-2 border-black">
    <span class="text-xs text-gray-500 tracking-wide mb-1">유저 총 변환수</span>

    <span
      :class="[
        'text-3xl font-semibold transition-all duration-300',
        animate ? 'scale-125 text-blue-600' : 'scale-100 text-gray-800'
      ]"
      @transitionend="animate = false"
    >
      {{ count }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  count: { type: Number, required: true }
})

const animate = ref(false)

watch(
  () => props.count,
  () => {
    animate.value = true
  }
)
</script>

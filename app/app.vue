<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue"

// ❗ 여기에 있어야 정상 작동함
const loading = ref(false)
</script>

<style>
html, body, #__nuxt, #__layout {
  height: 100%;
}
</style>

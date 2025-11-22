<template>
  <NuxtLayout>
    <NuxtPage />
    <Analytics />   <!-- ✅ 이 한 줄이 있어야 페이지뷰가 기록됨 -->
  </NuxtLayout>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<style>
html, body, #__nuxt, #__layout {
  height: 100%;
}
</style>

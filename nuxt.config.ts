import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  typescript: {
    typeCheck: false
  },
  runtimeConfig: {
  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKey: process.env.R2_ACCESS_KEY_ID,
    secretKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    r2Domain: process.env.R2_PUBLIC_DOMAIN,
  }
}


});

export default defineNuxtConfig({
  modules: ['nuxt-sanity-preview', '@nuxtjs/sanity'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',

  runtimeConfig: {
    previewSecret: process.env.NUXT_PREVIEW_SECRET,
  },

  sanity: {
    projectId: 'j1o4tmjp',
    dataset: 'production',
    apiVersion: '2024-01-01',
  },
})

<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
    <h1>nuxt-sanity-preview playground</h1>

    <div :style="{ padding: '0.5rem 1rem', marginBottom: '1.5rem', borderRadius: '6px', background: previewEnabled ? '#d1fae5' : '#f3f4f6', border: '1px solid', borderColor: previewEnabled ? '#6ee7b7' : '#e5e7eb' }">
      <strong>Preview mode:</strong>
      {{ previewEnabled ? '🟢 active — showing draft content' : '⚪ inactive — showing published content' }}
    </div>

    <p v-if="pending">Loading movies…</p>
    <p v-else-if="error" style="color: red;">Error: {{ error.message }}</p>
    <ul v-else style="list-style: none; padding: 0; display: grid; gap: 0.75rem;">
      <li
        v-for="movie in movies"
        :key="movie._id"
        style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;"
      >
        <span><strong>{{ movie.title }}</strong></span>
        <span style="color: #6b7280; font-size: 0.875rem;">{{ movie.releaseDate?.slice(0, 4) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Movie {
  _id: string
  title: string
  releaseDate?: string
}

const { enabled: previewEnabled } = usePreviewMode()

const { data: movies, pending, error } = await useSanityProxyQuery<Movie[]>(
  `*[_type == "movie"] | order(popularity desc) { _id, title, releaseDate }[0...20]`,
)

console.log('Movies:', movies.value)
</script>

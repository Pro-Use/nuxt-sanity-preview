# nuxt-sanity-preview

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that provides `useSanityProxyQuery` — a drop-in replacement for
`useSanityQuery` that transparently serves Sanity draft content when Sanity
preview mode is active, and falls back to the standard production query
otherwise.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🔍 &nbsp;`useSanityProxyQuery` auto-imported into your app — same API as `useSanityQuery`
- 🚧 &nbsp;Serves Sanity **draft** documents when preview mode is enabled
- 🔒 &nbsp;Token-validated server-side proxy — preview token never exposed to the client
- ⚡ &nbsp;Falls back to the standard production Sanity client when preview is off
- 🔄 &nbsp;Reactive — automatically re-fetches when preview mode is toggled

## Requirements

This module requires [`@nuxtjs/sanity`](https://github.com/nuxt-modules/sanity)
to be installed and registered in your app. It provides the underlying Sanity
client and `usePreviewMode` / `useSanityQuery` composables.

## Quick Setup

```bash
npm install nuxt-sanity-preview
```

Register both modules in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-sanity-preview', '@nuxtjs/sanity'],

  sanity: {
    projectId: 'your-project-id',
    dataset: 'production',
    apiVersion: '2024-01-01',
  },
})
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `NUXT_PREVIEW_SECRET` | Shared secret used to validate preview requests. Must match the token sent from the Sanity preview URL. |
| `NUXT_SANITY_PREVIEW_TOKEN` | A Sanity API token with **Viewer** (or higher) permissions, used server-side to fetch draft documents. |

You can also pass `previewSecret` directly via module options instead of the
environment variable:

```ts
export default defineNuxtConfig({
  sanityPreview: {
    previewSecret: 'my-secret',
  },
})
```

## Usage

`useSanityProxyQuery` is auto-imported — no explicit import needed:

```vue
<script setup lang="ts">
const { data: page } = await useSanityProxyQuery<PageType>(groqQuery, { slug })
</script>
```

When preview mode is **inactive**, this is equivalent to calling `useSanityQuery`.  
When preview mode is **active**, it routes the query through the server-side
proxy at `/api/sanity/query`, which fetches with `perspective: 'drafts'`.

## How it works

```
useSanityProxyQuery(query, params)
  │
  ├─ preview off ──► useSanityQuery()          (direct CDN fetch, published data)
  │
  └─ preview on  ──► POST /api/sanity/query    (server validates token)
                          │
                          ├─ valid token ──► Sanity client { perspective: 'drafts' }
                          └─ invalid     ──► Sanity client (published, fallback)
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-sanity-preview/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-sanity-preview

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-sanity-preview.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-sanity-preview

[license-src]: https://img.shields.io/npm/l/nuxt-sanity-preview.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-sanity-preview

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com


import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { query, params, options, previewToken } = await readBody(event)
  const config = useRuntimeConfig(event)

  const isPreview = previewToken && previewToken === config.previewSecret
  const sanity = useSanity(event)

  if (isPreview) {
    const client = sanity.client.withConfig({
      token: process.env.NUXT_SANITY_PREVIEW_TOKEN,
      perspective: 'drafts',
      useCdn: false,
    })
    return await client.fetch(query, params ?? {}, options ?? {})
  }

  return await sanity.fetch(query, params ?? {}, options ?? {})
})

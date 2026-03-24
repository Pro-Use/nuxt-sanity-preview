import { useAsyncData, usePreviewMode, useSanity } from '#imports'

export function useSanityProxyQuery<T = unknown>(
  query: string,
  params?: Record<string, unknown>,
  options?: Parameters<typeof useAsyncData>[2],
) {
  const { enabled, state } = usePreviewMode()
  const sanity = useSanity()

  const queryKey = 'sanity-proxy-' + query + (params ? JSON.stringify(params) : '')

  return useAsyncData<T>(
    queryKey,
    () => {
      if (enabled.value) {
        return $fetch<T>('/api/sanity/query', {
          method: 'POST',
          body: { query, params, previewToken: state.token },
        })
      }
      return sanity.fetch<T>(query, params ?? {})
    },
    { watch: [enabled], ...(options ?? {}) },
  )
}

import type { AsyncData, AsyncDataOptions, NuxtError } from 'nuxt/app'
import { useAsyncData, usePreviewMode, useSanity } from '#imports'

type UseSanityProxyQueryOptions<T> = {
  server?: AsyncDataOptions<T>['server']
  lazy?: AsyncDataOptions<T>['lazy']
  default?: () => T | undefined
  getCachedData?: AsyncDataOptions<T>['getCachedData']
  transform?: (input: T) => T | Promise<T>
  pick?: Array<Extract<keyof T, string>>
  immediate?: AsyncDataOptions<T>['immediate']
  deep?: AsyncDataOptions<T>['deep']
  dedupe?: AsyncDataOptions<T>['dedupe']
  timeout?: AsyncDataOptions<T>['timeout']
}

export function useSanityProxyQuery<T = unknown>(
  query: string,
  params?: Record<string, unknown>,
  options?: UseSanityProxyQueryOptions<T>,
): AsyncData<T | undefined, NuxtError<unknown> | undefined> {
  const { enabled, state } = usePreviewMode()
  const sanity = useSanity()

  const queryKey = 'sanity-proxy-' + query + (params ? JSON.stringify(params) : '')
  const asyncDataOptions = {
    watch: [enabled],
    ...(options ?? {}),
  } as AsyncDataOptions<T, T>

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
    asyncDataOptions,
  ) as AsyncData<T | undefined, NuxtError<unknown> | undefined>
}

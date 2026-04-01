import { defineNuxtModule, addPlugin, addImportsDir, addServerHandler, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Shared secret used to validate preview requests.
   * Can also be set via the NUXT_PREVIEW_SECRET environment variable.
   */
  previewSecret?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-sanity-preview',
    configKey: 'sanityPreview',
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Inject previewSecret into private runtime config so the server handler can validate tokens.
    // The consuming app can set NUXT_PREVIEW_SECRET env var or pass previewSecret via module options.
    nuxt.options.runtimeConfig.previewSecret
      = nuxt.options.runtimeConfig.previewSecret || options.previewSecret || ''

    // Auto-import useSanityProxyQuery into consuming apps
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Register the server-side proxy route
    addServerHandler({
      route: '/api/sanity/query',
      handler: resolver.resolve('./runtime/server/api/sanity/query.post'),
    })

    // Client-only plugin to initialise preview mode state on app load
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })
  },
})

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID: string
  readonly SANITY_API_TOKEN: string
  readonly SANITY_STUDIO_PREVIEW_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

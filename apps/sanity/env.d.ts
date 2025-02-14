/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID: string
  readonly SANITY_STUDIO_PREVIEW_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import { createClient, type QueryParams } from '@sanity/client'
import { isPreviewDeployment } from './is-preview-deployment'

const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || import.meta.env.SANITY_API_TOKEN
const PROJECT_ID = process.env.SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID

if (!PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID in environment variables')
}

if (isPreviewDeployment && !SANITY_API_TOKEN) {
  console.warn('\x1b[33m%s\x1b[0m', 'The `SANITY_API_TOKEN` environment variable is required.')
}

export const client = createClient({
  projectId: PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-10-15',
  useCdn: false,
  perspective: isPreviewDeployment ? 'previewDrafts' : 'published',
  ...(isPreviewDeployment && { token: SANITY_API_TOKEN }),
})

export default async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string
  params?: QueryParams
}): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params)
}

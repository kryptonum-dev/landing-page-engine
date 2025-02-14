import { Iframe, type IframeProps } from 'sanity-plugin-iframe-pane'

export const Preview = ({ document }: { document: IframeProps['document'] }) => {
  const getPreviewInfo = (missing: 'slug' | 'domain') => {
    return <div style={{ padding: '1rem' }}>🛑 Preview not available: The {missing} is missing</div>
  }

  const slug = (document.displayed.slug as { current?: string })?.current
  if (!slug) return getPreviewInfo('slug')
  if (!process.env.SANITY_STUDIO_PREVIEW_DOMAIN) return getPreviewInfo('domain')
  return (
    <Iframe
      document={document}
      options={{ url: `${process.env.SANITY_STUDIO_PREVIEW_DOMAIN}${slug}`, reload: { button: true } }}
    />
  )
}

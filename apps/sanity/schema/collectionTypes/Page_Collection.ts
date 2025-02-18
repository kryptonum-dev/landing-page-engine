import { defineField, defineType } from 'sanity'
import { defineSlugForDocument } from '../../utils/define-slug-for-document'

const icon = () => '📄'

export default defineType({
  name: 'page',
  title: 'Landing',
  type: 'document',
  icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'localSettings',
      title: 'Local Settings',
      description: 'Override global settings specifically for this page',
      type: 'object',
      group: 'localSettings',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'email',
          type: 'string',
          title: 'Email',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'tel',
          type: 'string',
          title: 'Phone number (optional)',
        }),
      ],
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Individual name for this landing page, used for Sanity Display Name',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    ...defineSlugForDocument({ source: 'name' }).map((field) => ({ ...field, group: 'content' })),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
      group: 'content',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'content',
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      group: 'analytics',
      options: { collapsible: true },
      description:
        'Configure analytics tracking tools to monitor page performance and user behavior. Leave fields empty to disable tracking.',
      fields: [
        defineField({
          name: 'gtmId',
          type: 'string',
          title: 'Google Tag Manager ID',
          description: 'Format: GTM-XXXXXX. Container ID for managing analytics tools (GA4, Facebook Pixel, etc.).',
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true
              if (!/^GTM-[A-Z0-9]{6,}$/.test(value)) {
                return 'GTM ID must be in format GTM-XXXXXX'
              }
              return true
            }),
        }),
      ],
    }),
  ],
  groups: [
    {
      name: 'localSettings',
      title: '⚙️ Local Settings',
    },
    {
      name: 'content',
      title: '📝 Content',
    },
    {
      name: 'analytics',
      title: '📊 Analytics',
    },
  ],
  preview: {
    select: {
      title: 'seo.title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug,
        icon,
      }
    },
  },
})

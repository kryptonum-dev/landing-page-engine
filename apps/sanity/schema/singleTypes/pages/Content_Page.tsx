import { defineField, defineType } from 'sanity'
import { defineSlugForDocument } from '../../../utils/define-slug-for-document'

export default defineType({
  name: 'Content_Page',
  type: 'document',
  title: 'Page Content',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required(),
    }),
    ...defineSlugForDocument({ source: 'name' }),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      validation: (Rule) =>
        Rule.custom((value: { img?: { asset?: { _ref: string } } }) => {
          if (!value?.img?.asset?._ref) {
            return 'Social Share Image is required for Content Pages'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})

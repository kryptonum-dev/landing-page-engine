import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'NotFound_Page',
  type: 'document',
  title: 'Not Found Page (404)',
  icon: () => '🔍',
  fields: [
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
    }),
  ],
  preview: {
    prepare: () => ({
      title: '404 Page',
    }),
  },
})

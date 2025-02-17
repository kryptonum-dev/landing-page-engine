import { defineField, defineType } from 'sanity'

const name = 'NotFound_Page'
const title = 'Not Found Page (404)'
const icon = () => '🔍'

export default defineType({
  name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      description: 'Additional content for the 404 page',
      of: [{ type: 'PortableText' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: '404 Page',
    }),
  },
})

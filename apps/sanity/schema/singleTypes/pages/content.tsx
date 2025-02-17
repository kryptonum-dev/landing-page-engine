import { defineField, defineType } from 'sanity'

const name = 'Page_Content'
const title = 'Page Content'
const icon = () => '📝'

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
      description: 'Add, edit, and reorder content sections',
      of: [{ type: 'PortableText' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'description',
    },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Page Content',
      subtitle: subtitle,
    }),
  },
})

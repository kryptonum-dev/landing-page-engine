import { defineField } from 'sanity'

export default defineField({
  name: 'socials',
  type: 'object',
  title: 'Social media',
  options: { collapsible: true },
  fields: [
    defineField({
      name: 'instagram',
      type: 'url',
      title: 'Instagram',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
    defineField({
      name: 'facebook',
      type: 'url',
      title: 'Facebook',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
    defineField({
      name: 'tiktok',
      type: 'url',
      title: 'TikTok',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
    defineField({
      name: 'linkedin',
      type: 'url',
      title: 'LinkedIn',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
  ],
})

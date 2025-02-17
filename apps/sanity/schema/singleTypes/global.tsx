import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'global',
  type: 'document',
  title: 'Global Settings',
  description:
    'Global settings will apply for all landing pages. If the landing local settings are set, they will take precedence.',
  icon: () => '🌍',
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
    defineField({
      name: 'socials',
      type: 'socials',
      title: 'Social media',
    }),
    defineField({
      name: 'address',
      type: 'address',
      title: 'Address (optional)',
    }),
    defineField({
      name: 'organization',
      type: 'OrganizationSchema',
      title: 'Organization',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Global settings',
    }),
  },
})

import { defineField, defineType } from 'sanity'

const name = 'Local_Settings'
const title = 'Local Settings'
const icon = () => '🎯'

export default defineType({
  name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Local Email',
      description: 'Local email address specific to this page (overrides global email if set)',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Local Phone number (optional)',
      description: 'Local phone number specific to this page (overrides global phone if set)',
    }),
    defineField({
      name: 'socials',
      type: 'object',
      title: 'Local Social Media',
      description: 'Social media links specific to this page (override global socials if set)',
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
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'Local SEO',
      description: 'SEO settings specific to this page (override global SEO if set)',
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Social Share Image',
          description:
            'Local social share image (overrides global image if set). The dimensions of the image should be 1200x630px. For maximum compatibility, use JPG or PNG formats.',
        }),
      ],
    }),
    defineField({
      name: 'OrganizationSchema',
      type: 'object',
      title: 'Local Organization Data',
      description: 'Local organization structured data (overrides global data if set)',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          description: 'Local organization name specific to this page.',
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 3,
          title: 'Description',
          description: 'Local organization description specific to this page.',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Local Settings',
    }),
  },
})

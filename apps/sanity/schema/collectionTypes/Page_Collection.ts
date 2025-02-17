import { defineField, defineType } from 'sanity'

const title = 'Landings'
const icon = () => '📄'

export default defineType({
  name: 'page',
  title,
  type: 'document',
  icon,
  groups: [
    {
      name: 'local_settings',
      title: 'Local Settings',
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'not_found',
      title: '404 Page',
    },
    {
      name: 'faq',
      title: 'FAQ',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    // Local Settings
    defineField({
      name: 'email',
      type: 'string',
      title: 'Local Email',
      group: 'local_settings',
      description: 'Local email address specific to this page (overrides global email if set)',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Local Phone number (optional)',
      group: 'local_settings',
      description: 'Local phone number specific to this page (overrides global phone if set)',
    }),
    defineField({
      name: 'socials',
      type: 'object',
      title: 'Local Social Media',
      group: 'local_settings',
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
      name: 'localSeo',
      type: 'object',
      title: 'Local SEO',
      group: 'local_settings',
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
      name: 'localOrganization',
      type: 'object',
      title: 'Local Organization Data',
      group: 'local_settings',
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
    // Page Content
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      group: 'content',
      description: 'Add, edit, and reorder content sections',
      of: [{ type: 'PortableText' }],
      validation: (Rule) => Rule.required(),
    }),
    // 404 Page
    defineField({
      name: 'notFoundHeadline',
      type: 'string',
      title: 'Headline',
      group: 'not_found',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notFoundDescription',
      type: 'text',
      title: 'Description',
      group: 'not_found',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notFoundContent',
      type: 'array',
      title: 'Content',
      group: 'not_found',
      description: 'Additional content for the 404 page',
      of: [{ type: 'PortableText' }],
      validation: (Rule) => Rule.required(),
    }),
    // FAQ Collection
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      group: 'faq',
      of: [
        defineField({
          name: 'faq',
          type: 'object',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'question',
              type: 'Heading',
              title: 'Question',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'PortableText',
              title: 'Answer',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
    },
    prepare: ({ title, slug }) => ({
      title: title || 'Page',
      subtitle: slug?.current,
      icon,
    }),
  },
})

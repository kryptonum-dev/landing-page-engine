import { defineField, defineType } from 'sanity'

const title = 'Pages'
const icon = () => '📄'

export default defineType({
  name: 'page',
  title,
  type: 'document',
  icon,
  groups: [
    {
      name: 'page_type',
      title: 'Page Type',
    },
    {
      name: 'local_settings',
      title: 'Local Settings',
    },
    {
      name: 'front_page',
      title: 'Front Page Content',
    },
    {
      name: 'not_found',
      title: '404 Page Content',
    },
    {
      name: 'privacy_policy',
      title: 'Privacy Policy Content',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'local_settings',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'page_type',
      options: {
        list: [
          { title: 'Front Page', value: 'frontPage' },
          { title: '404 Page', value: 'notFound' },
          { title: 'Privacy Policy', value: 'privacyPolicy' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Front Page specific fields
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'front_page',
      hidden: ({ document }) => document?.pageType !== 'frontPage',
    }),
    // 404 Page specific fields
    defineField({
      name: 'notFoundMessage',
      title: '404 Message',
      type: 'text',
      group: 'not_found',
      hidden: ({ document }) => document?.pageType !== 'notFound',
    }),
    // Privacy Policy specific fields
    defineField({
      name: 'privacyContent',
      title: 'Privacy Policy Content',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'privacy_policy',
      hidden: ({ document }) => document?.pageType !== 'privacyPolicy',
    }),
  ],
})

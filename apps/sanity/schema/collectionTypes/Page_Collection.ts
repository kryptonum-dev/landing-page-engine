import { defineField, defineType } from 'sanity'
import { defineSlugForDocument } from '../../utils/define-slug-for-document'

const icon = () => '📄'

export default defineType({
  name: 'page',
  title: 'Landing',
  type: 'document',
  icon,
  groups: [
    {
      name: 'localSettings',
      title: 'Local Settings',
      default: true,
      icon: () => '⚙️',
    },
    {
      name: 'contentPage',
      title: 'Content Page',
      icon: () => '📝',
    },
    {
      name: 'notFoundPage',
      title: 'Not Found Page (404)',
      icon: () => '🔍',
    },
  ],
  fields: [
    defineField({
      name: 'localSettings',
      title: 'Local Settings',
      description: 'Override global settings specifically for this page',
      type: 'object',
      group: 'localSettings',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'email',
          type: 'string',
          title: 'Email',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              // Get the global settings document
              const globalSettings = context
                .getClient({ apiVersion: '2023-01-01' })
                .fetch('*[_type == "global"][0].email')
                .then((email) => {
                  // If there's no global email and no local email, require the local email
                  if (!email && !value) {
                    return 'Email is required when no global email is set'
                  }
                  // If there is a value, validate it's a proper email
                  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    return 'Please enter a valid email address'
                  }
                  return true
                })
              return globalSettings
            }),
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
          validation: (Rule) =>
            Rule.custom(
              async (
                value:
                  | {
                      name?: string
                      description?: string
                    }
                  | undefined,
                context
              ) => {
                const globalOrg = await context
                  .getClient({ apiVersion: '2023-01-01' })
                  .fetch('*[_type == "global"][0].organization')

                if (!globalOrg?.name && !value?.name) {
                  return 'Organization name is required when no global organization name is set'
                }

                if (!globalOrg?.description && !value?.description) {
                  return 'Organization description is required when no global organization description is set'
                }

                return true
              }
            ),
        }),
      ],
    }),
    defineField({
      name: 'contentPage',
      title: 'Content Page',
      description: 'Main content and settings for this landing page',
      type: 'object',
      group: 'contentPage',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          validation: (Rule) => Rule.required(),
        }),
        ...defineSlugForDocument({ source: 'contentPage.name' }),
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
    }),
    defineField({
      name: 'notFoundPage',
      title: 'Not Found Page (404)',
      description: 'Content and settings specific to the 404 error page',
      type: 'object',
      group: 'notFoundPage',
      validation: (Rule) => Rule.required(),
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
    }),
  ],
  preview: {
    select: {
      title: 'contentPage.name',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled',
        icon,
      }
    },
  },
})

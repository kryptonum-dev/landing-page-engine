import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'global',
  type: 'document',
  title: 'Global',
  description:
    'Global settings will apply for all landing pages. If the landing local settings are set, they will take precedence.',
  icon: () => '🌍',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number (optional)',
    }),
    defineField({
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
    }),
    defineField({
      name: 'address',
      type: 'object',
      title: 'Address (optional)',
      options: { columns: 2, collapsible: true },
      fields: [
        defineField({
          name: 'street',
          type: 'string',
          title: 'Street',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          type: 'string',
          title: 'City',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'postalCode',
          type: 'string',
          title: 'Postal Code',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'country',
          type: 'string',
          title: 'Country Code',
          description: 'Use uppercase ISO 3166-1 country code (e.g., PL or POL)',
          validation: (Rule) =>
            Rule.required()
              .uppercase()
              .custom((value) => {
                if (!value) return true
                if (!/^[A-Z]{2,3}$/.test(value)) {
                  return 'Country code must be 2 or 3 uppercase letters (ISO 3166-1 Alpha-2 or Alpha-3)'
                }
                return true
              }),
        }),
      ],
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

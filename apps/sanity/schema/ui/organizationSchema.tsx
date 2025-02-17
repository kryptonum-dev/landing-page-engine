import { defineField } from 'sanity'

export default defineField({
  name: 'OrganizationSchema',
  type: 'object',
  title: 'Organization structured data',
  description: (
    <>
      Learn more about{' '}
      <a
        href="https://developers.google.com/search/docs/appearance/structured-data/organization?hl=en"
        target="_blank"
        rel="noreferrer"
      >
        Organization structured data
      </a>
    </>
  ),
  options: { collapsible: true },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Enter the name of your organization as you want it to appear in search results.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Description',
      description: 'A brief description of your organization that will appear in search results.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'businessDetails',
      type: 'object',
      title: 'Business Details (optional)',
      description:
        "Additional business information that enhances your organization's visibility in search results and builds trust with potential customers. While optional, providing these details can significantly improve your SEO ranking.",
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'vatID',
          type: 'string',
          title: 'VAT ID (NIP)',
          validation: (Rule) => Rule.regex(/^[0-9]{10}$/, 'NIP must be 10 digits'),
        }),
        defineField({
          name: 'regon',
          type: 'string',
          title: 'REGON',
          validation: (Rule) => Rule.regex(/^[0-9]{9}$/, 'REGON must be 9 digits'),
        }),
        defineField({
          name: 'legalName',
          type: 'string',
          title: 'Legal Company Name',
        }),
        defineField({
          name: 'foundingDate',
          type: 'date',
          title: 'Company Founding Date',
        }),
        defineField({
          name: 'founder',
          type: 'string',
          title: 'Founder (Full Name)',
        }),
      ],
    }),
  ],
})

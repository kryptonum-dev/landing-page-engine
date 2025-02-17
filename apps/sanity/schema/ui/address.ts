import { defineField } from 'sanity'

export default defineField({
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
})

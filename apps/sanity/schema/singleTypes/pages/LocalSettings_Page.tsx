import { defineField, defineType } from 'sanity'

type OrganizationValue = {
  name?: string
  description?: string
}

export default defineType({
  name: 'LocalSettings_Page',
  type: 'document',
  title: 'Local Settings',
  icon: () => '🎯',
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
      description: 'Will override the global email.',
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number (optional)',
      description: 'Will override the global phone number.',
    }),
    defineField({
      name: 'socials',
      type: 'socials',
      title: 'Social media',
      description: 'Will override the global social media.',
    }),
    defineField({
      name: 'address',
      type: 'address',
      title: 'Address (optional)',
      description: 'Will override the global address.',
    }),
    defineField({
      name: 'organization',
      type: 'OrganizationSchema',
      title: 'Organization',
      validation: (Rule) =>
        Rule.custom(async (value: OrganizationValue | undefined, context) => {
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
        }),
      description: 'Will override the global organization.',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Local Settings',
    }),
  },
})

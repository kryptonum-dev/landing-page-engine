import { DOMAIN } from '@/global/constants'
import sanityFetch from './sanity.fetch'

export type PageAnalyticsData = {
  analytics: {
    metaPixelId: string | null
    metaConversionToken: string | null
    gtmId: string | null
  }
  additionalData?: {
    user_role: string
    event_hour: string
    event_day: string
    event_month: string
    page_url: string
    page_title: string
    page_type: string
    content_name: string
    content_category: string
    content_id: string
    content_description: string
    content_language: string
  }
}

export async function getPageAnalyticsData(slug: string): Promise<PageAnalyticsData> {
  try {
    const pageData = await sanityFetch<{
      analytics: {
        metaPixelId: string | null
        metaConversionToken: string | null
        gtmId: string | null
      }
      name: string
      _id: string
      seo: {
        title: string
        description: string
      }
      slug: string
    }>({
      query: `*[_type == "page" && slug.current == $slug][0]{
        analytics {
          metaPixelId,
          metaConversionToken,
          gtmId
        },
        name,
        "slug": slug.current,
        _id,
        seo {
          title,
          description
        },
      }`,
      params: { slug },
    })

    if (!pageData) {
      return {
        analytics: {
          metaPixelId: null,
          metaConversionToken: null,
          gtmId: null,
        },
      }
    }

    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const eventHour = `${hours.toString().padStart(2, '0')}-${minutes.toString().padStart(2, '0')}`
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const eventDay = days[now.getDay()]
    const eventMonth = months[now.getMonth()]
    const fullUrl = `https://${DOMAIN}/${pageData.slug}`

    return {
      analytics: pageData.analytics,
      additionalData: {
        user_role: 'guest',
        event_hour: eventHour,
        event_day: eventDay,
        event_month: eventMonth,
        page_url: fullUrl,
        page_title: pageData.seo.title,
        page_type: 'landing_page',
        content_name: pageData.name,
        content_category: 'Bez kategorii',
        content_id: pageData._id,
        content_description: pageData.seo.description,
        content_language: 'pl',
      },
    }
  } catch (error) {
    console.error('Failed to fetch page analytics data from Sanity:', error)
    return {
      analytics: {
        metaPixelId: null,
        metaConversionToken: null,
        gtmId: null,
      },
    }
  }
}

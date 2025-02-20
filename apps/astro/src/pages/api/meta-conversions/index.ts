import { hash } from '@/utils/hash'
import sanityFetch from '@/utils/sanity.fetch'
import type { APIRoute } from 'astro'

type UserData = {
  email?: string
  eventName: string
  eventSource: string
  contentName: string
  additionalUserData?: Record<string, string>
  additionalCustomData?: Record<string, any>
  slug?: string
  event_id: string
  event_time: number
}

type AnalyticsCredentials = {
  metaPixelId: string | null
  metaConversionToken: string | null
}

async function getCredentials(slug?: string): Promise<AnalyticsCredentials | undefined> {
  try {
    if (slug) {
      const analytics = await sanityFetch<AnalyticsCredentials>({
        query: `
          *[_type == "page" && slug.current == $slug][0].analytics {
            metaPixelId,
            metaConversionToken,
          }
        `,
        params: { slug: slug },
      })

      if (!analytics) return undefined
      return analytics
    }
  } catch (error) {
    console.error('Failed to fetch analytics credentials from Sanity:', error)
    return {
      metaPixelId: null,
      metaConversionToken: null,
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const userData = (await request.json()) as UserData
    const {
      email,
      eventName,
      eventSource,
      contentName,
      additionalUserData,
      additionalCustomData,
      slug,
      event_id,
      event_time,
    } = userData

    const credentials = await getCredentials(slug)
    if (!credentials || !credentials.metaPixelId || !credentials.metaConversionToken) {
      return new Response(
        JSON.stringify({
          message: 'Analytics credentials not found',
          success: false,
        }),
        { status: 400 }
      )
    }

    const cookies =
      request.headers
        .get('cookie')
        ?.split(';')
        .reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=')
            acc[key] = value
            return acc
          },
          {} as Record<string, string>
        ) || {}

    const cookieConsent = cookies['cookie-consent']
    if (!cookieConsent) {
      return new Response(
        JSON.stringify({
          message: 'No cookie consent found',
          success: false,
        }),
        { status: 400 }
      )
    }

    const consentSettings = JSON.parse(decodeURIComponent(cookieConsent))
    if (consentSettings.conversion_api !== 'granted') {
      return new Response(
        JSON.stringify({
          message: 'Conversion API consent not granted',
          success: false,
        }),
        { status: 400 }
      )
    }

    const canUseAdvancedMatching = consentSettings.advanced_matching === 'granted'

    const { metaPixelId, metaConversionToken } = credentials

    const client_ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const client_user_agent = request.headers.get('user-agent')
    const referer = request.headers.get('referer')

    const fbc = cookies._fbc
    const fbp = cookies._fbp

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${metaPixelId}/events?access_token=${metaConversionToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_id,
              event_name: eventName,
              event_time,
              action_source: eventSource,
              event_source_url: referer,
              user_data: {
                ...(canUseAdvancedMatching
                  ? {
                      client_ip_address,
                      client_user_agent,
                      ...(email && { em: await hash(email) }),
                      ...(fbc && { fbc }),
                      ...(fbp && { fbp }),
                    }
                  : {}),
                ...additionalUserData,
              },
              custom_data: {
                content_name: contentName,
                ...additionalCustomData,
              },
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          message: 'Failed to send conversion event',
          success: false,
        }),
        { status: response.status }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Successfully sent conversion event',
        success: true,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in meta-conversions API:', error)
    return new Response(
      JSON.stringify({
        message: 'An error occurred while processing the conversion event',
        success: false,
      }),
      { status: 500 }
    )
  }
}

import { hash } from '@/utils/hash'
import sanityFetch from '@/utils/sanity.fetch'

type UserData = {
  email: string
  headers: Headers
  eventName: string
  eventSource: string
  contentName: string
  additionalUserData?: Record<string, string>
  additionalCustomData?: Record<string, any>
}

type AnalyticsCredentials = {
  metaPixelId: string | null
  metaConversionToken: string | null
}

async function getCredentials(slug?: string): Promise<AnalyticsCredentials | undefined> {
  try {
    if (slug) {
      // First try to get page-specific analytics
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
    }
  } catch (error) {
    console.error('Failed to fetch analytics credentials from Sanity:', error)
    return {
      metaPixelId: null,
      metaConversionToken: null,
    }
  }
}

async function sendToFacebook(userData: UserData, slug?: string) {
  const credentials = await getCredentials(slug)
  if (!credentials) return

  const { email, headers, eventName, eventSource, contentName, additionalUserData, additionalCustomData } = userData

  // Check for marketing consent from cookies header
  const cookies =
    headers
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
  if (!cookieConsent) return // No consent given yet

  try {
    const consentSettings = JSON.parse(decodeURIComponent(cookieConsent))
    // Check for specific marketing consent flags
    if (consentSettings.conversion_api !== 'granted') {
      console.info('Conversion API consent not granted, skipping Facebook Conversion API')
      return
    }

    // Check if we can use advanced matching
    const canUseAdvancedMatching = consentSettings.advanced_matching === 'granted'

    const { metaPixelId, metaConversionToken } = credentials

    const current_timestamp = Math.floor(Date.now() / 1000)
    const client_ip_address = headers.get('x-forwarded-for') || headers.get('x-real-ip')
    const client_user_agent = headers.get('user-agent')
    const referer = headers.get('referer')

    const fbc = cookies._fbc
    const fbp = cookies._fbp

    try {
      await fetch(`https://graph.facebook.com/v21.0/${metaPixelId}/events?access_token=${metaConversionToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName,
              event_time: current_timestamp,
              action_source: eventSource,
              event_source_url: referer,
              user_data: {
                ...(canUseAdvancedMatching
                  ? {
                      client_ip_address,
                      client_user_agent,
                      em: await hash(email),
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
      })
    } catch (error) {
      console.error('Failed to send Facebook conversion event:', error)
    }
  } catch (error) {
    console.error('Failed to parse consent settings:', error)
    return
  }
}

// Future implementation for TikTok
// async function sendToTikTok(userData: UserData) {
//   const { tiktokPixelId, tiktokApiKey } = await getCredentials()
//   if (!tiktokPixelId || !tiktokApiKey) return
//   // TikTok Conversion API implementation
// }

export async function sendConversion(userData: UserData, slug?: string) {
  await Promise.all([
    sendToFacebook(userData, slug),
    // Add other platforms here in the future
    // sendToTikTok(userData),
  ])
}

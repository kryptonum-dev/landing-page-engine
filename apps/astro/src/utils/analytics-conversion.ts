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

async function getCredentials(slug?: string): Promise<AnalyticsCredentials> {
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

      if (analytics?.metaPixelId && analytics?.metaConversionToken) {
        return analytics
      }
    }

    // Fallback to global analytics if no page-specific analytics found
    const { analytics } = await sanityFetch<{ analytics: AnalyticsCredentials }>({
      query: `
        *[_type == "global"][0].analytics {
          metaPixelId,
          metaConversionToken,
        }
      `,
    })
    return analytics
  } catch (error) {
    console.error('Failed to fetch analytics credentials from Sanity:', error)
    return {
      metaPixelId: null,
      metaConversionToken: null,
    }
  }
}

async function sendToFacebook(userData: UserData, slug?: string) {
  const { metaPixelId, metaConversionToken } = await getCredentials(slug)
  if (!metaPixelId || !metaConversionToken) return

  const current_timestamp = Math.floor(Date.now() / 1000)
  const { email, headers, eventName, eventSource, contentName, additionalUserData, additionalCustomData } = userData
  const client_ip_address = headers.get('x-forwarded-for') || headers.get('x-real-ip')
  const client_user_agent = headers.get('user-agent')
  const referer = headers.get('referer')

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

  const fbc = cookies._fbc
  const fbp = cookies._fbp

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${metaPixelId}/events?access_token=${metaConversionToken}`,
      {
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
                client_ip_address,
                client_user_agent,
                em: await hash(email),
                ...(fbc && { fbc }),
                ...(fbp && { fbp }),
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
  } catch (error) {
    console.error('Failed to send Facebook conversion event:', error)
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

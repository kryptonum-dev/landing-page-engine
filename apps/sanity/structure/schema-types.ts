// Single Types
import global from '../schema/singleTypes/global'
import redirects from '../schema/singleTypes/redirects'
import NotFound_Page from '../schema/singleTypes/pages/404'
import Page_Content from '../schema/singleTypes/pages/content'
import Local_Settings from '../schema/singleTypes/pages/local'

const singleTypes = [global, redirects, NotFound_Page, Page_Content, Local_Settings]

// Collections Types
import Faq_Collection from '../schema/collectionTypes/Faq_Collection'
import Page_Collection from '../schema/collectionTypes/Page_Collection'

const collectionTypes = [Faq_Collection, Page_Collection]

// Components
import Components from '../schema/Components'

const components = [Components]

// UI Components
import cta from '../schema/ui/cta'
import PortableText from '../schema/ui/PortableText'
import Heading from '../schema/ui/PortableText/Heading'
import seo from '../schema/ui/seo'
import OrganizationSchema from '../schema/ui/organizationSchema'

const ui = [cta, seo, PortableText, Heading, OrganizationSchema]

export const schemaTypes = [...singleTypes, ...collectionTypes, ...components, ...ui]

export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
export const singletonTypes = new Set(singleTypes.map((type) => type.name as string))

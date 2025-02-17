// Single Types
import global from '../schema/singleTypes/global'
import redirects from '../schema/singleTypes/redirects'

const singleTypes = [global, redirects]

// Collections Types
import Page_Collection from '../schema/collectionTypes/Page_Collection'

const collectionTypes = [Page_Collection]

// Components
import Components from '../schema/Components'

const components = [Components]

// UI Components
import Address from '../schema/ui/address'
import cta from '../schema/ui/cta'
import OrganizationSchema from '../schema/ui/organizationSchema'
import PortableText from '../schema/ui/PortableText'
import Heading from '../schema/ui/PortableText/Heading'
import seo from '../schema/ui/seo'
import Socials from '../schema/ui/socials'

const ui = [cta, seo, PortableText, Heading, OrganizationSchema, Address, Socials]

export const schemaTypes = [...singleTypes, ...collectionTypes, ...components, ...ui]

export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
export const singletonTypes = new Set(singleTypes.map((type) => type.name as string))

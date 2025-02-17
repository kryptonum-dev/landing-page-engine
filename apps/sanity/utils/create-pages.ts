import type { StructureBuilder } from 'sanity/structure'
import { schemaTypes } from '../structure/schema-types'
import { createCollection } from './create-collection'
import { createSingleton } from './create-singleton'

export const createPages = (S: StructureBuilder, name: string) => {
  const { title, icon, options } = schemaTypes.find((item) => item.name === name) as {
    title: string
    icon: React.ReactNode
    options: { documentPreview?: boolean }
  }

  return S.listItem()
    .id(name)
    .title(title)
    .icon(icon)
    .child(
      S.documentTypeList(name)
        .title(title)
        .child(() =>
          S.list()
            .title('Landing Properties')
            .items([
              createSingleton(S, 'NotFound_Page'),
              createSingleton(S, 'Page_Content'),
              createSingleton(S, 'Local_Settings'),
              createCollection(S, 'Faq_Collection'),
            ])
        )
    )
}

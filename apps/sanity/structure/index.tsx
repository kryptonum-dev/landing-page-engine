import type { StructureResolver } from 'sanity/structure'
import { createSingleton } from '../utils/create-singleton'
import { createPages } from '../utils/create-pages'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([createSingleton(S, 'global'), createSingleton(S, 'redirects'), createPages(S, 'page')])

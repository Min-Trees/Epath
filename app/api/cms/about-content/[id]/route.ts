import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { AboutContentSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.aboutContent, schema: AboutContentSchema })
export const DELETE = makeDeleteHandler(CollectionNames.aboutContent)

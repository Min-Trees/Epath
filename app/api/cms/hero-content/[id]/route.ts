import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { HeroContentSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.heroContent, schema: HeroContentSchema })
export const DELETE = makeDeleteHandler(CollectionNames.heroContent)

import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { HeroContentSchema } from '@/lib/cms-types'
import { CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.heroContent)
export const POST = makeCreateHandler({ name: CollectionNames.heroContent, schema: HeroContentSchema })

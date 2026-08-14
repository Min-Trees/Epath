import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { AboutContentSchema } from '@/lib/cms-types'
import { CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.aboutContent)
export const POST = makeCreateHandler({ name: CollectionNames.aboutContent, schema: AboutContentSchema })

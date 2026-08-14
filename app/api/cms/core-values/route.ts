import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { CoreValueSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.coreValues)
export const POST = makeCreateHandler({ name: CollectionNames.coreValues, schema: CoreValueSchema })
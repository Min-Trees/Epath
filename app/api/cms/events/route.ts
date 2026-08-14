import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { EventSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.events)
export const POST = makeCreateHandler({ name: CollectionNames.events, schema: EventSchema })
import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { EventSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.events, schema: EventSchema })
export const DELETE = makeDeleteHandler(CollectionNames.events)
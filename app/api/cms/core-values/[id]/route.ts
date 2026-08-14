import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { CoreValueSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.coreValues, schema: CoreValueSchema })
export const DELETE = makeDeleteHandler(CollectionNames.coreValues)
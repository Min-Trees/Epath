import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { ProgramSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.programs, schema: ProgramSchema })
export const DELETE = makeDeleteHandler(CollectionNames.programs)
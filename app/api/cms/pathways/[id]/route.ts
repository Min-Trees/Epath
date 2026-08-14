import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { LearningPathwaySchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.learningPathways,
  schema: LearningPathwaySchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.learningPathways)
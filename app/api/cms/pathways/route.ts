import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { LearningPathwaySchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.learningPathways)
export const POST = makeCreateHandler({
  name: CollectionNames.learningPathways,
  schema: LearningPathwaySchema,
})
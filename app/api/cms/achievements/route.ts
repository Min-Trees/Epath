import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { AchievementSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.achievements)
export const POST = makeCreateHandler({
  name: CollectionNames.achievements,
  schema: AchievementSchema,
})
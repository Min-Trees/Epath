import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { AchievementSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.achievements,
  schema: AchievementSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.achievements)
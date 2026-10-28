import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { AchievementsContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.achievementsContent,
  schema: AchievementsContentSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.achievementsContent)

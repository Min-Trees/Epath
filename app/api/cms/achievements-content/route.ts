import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { AchievementsContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = makeListHandler(CollectionNames.achievementsContent)
export const POST = makeCreateHandler({
  name: CollectionNames.achievementsContent,
  schema: AchievementsContentSchema,
})

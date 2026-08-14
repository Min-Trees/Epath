import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { TeamMemberSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.teamMembers)
export const POST = makeCreateHandler({
  name: CollectionNames.teamMembers,
  schema: TeamMemberSchema,
})
import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { TeamMemberSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.teamMembers,
  schema: TeamMemberSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.teamMembers)
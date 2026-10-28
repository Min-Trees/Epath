import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { ProgramsContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.programsContent,
  schema: ProgramsContentSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.programsContent)

import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { ProgramsContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = makeListHandler(CollectionNames.programsContent)
export const POST = makeCreateHandler({
  name: CollectionNames.programsContent,
  schema: ProgramsContentSchema,
})

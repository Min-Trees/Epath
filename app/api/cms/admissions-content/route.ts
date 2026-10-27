import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { AdmissionsContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = makeListHandler(CollectionNames.admissionsContent)
export const POST = makeCreateHandler({ name: CollectionNames.admissionsContent, schema: AdmissionsContentSchema })

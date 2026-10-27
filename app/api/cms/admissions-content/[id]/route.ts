import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { AdmissionsContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = makeUpdateHandler({ name: CollectionNames.admissionsContent, schema: AdmissionsContentSchema })
export const DELETE = makeDeleteHandler(CollectionNames.admissionsContent)

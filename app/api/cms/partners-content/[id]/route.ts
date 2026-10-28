import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { PartnersContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.partnersContent,
  schema: PartnersContentSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.partnersContent)

import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { PartnersContentSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = makeListHandler(CollectionNames.partnersContent)
export const POST = makeCreateHandler({
  name: CollectionNames.partnersContent,
  schema: PartnersContentSchema,
})

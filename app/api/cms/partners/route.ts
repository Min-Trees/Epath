import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { PartnerSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.partners)
export const POST = makeCreateHandler({ name: CollectionNames.partners, schema: PartnerSchema })
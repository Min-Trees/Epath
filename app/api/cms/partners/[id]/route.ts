import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { PartnerSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.partners, schema: PartnerSchema })
export const DELETE = makeDeleteHandler(CollectionNames.partners)
import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { FAQSchema } from '@/lib/cms-types'
import { CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.faqs, schema: FAQSchema })
export const DELETE = makeDeleteHandler(CollectionNames.faqs)
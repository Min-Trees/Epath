import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { TestimonialSchema } from '@/lib/cms-types'
import { CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.testimonials)
export const POST = makeCreateHandler({ name: CollectionNames.testimonials, schema: TestimonialSchema })

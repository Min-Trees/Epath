import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { TestimonialSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.testimonials, schema: TestimonialSchema })
export const DELETE = makeDeleteHandler(CollectionNames.testimonials)

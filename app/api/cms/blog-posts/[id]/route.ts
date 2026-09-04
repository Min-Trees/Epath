import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { BlogPostSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.blogPosts,
  schema: BlogPostSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.blogPosts)
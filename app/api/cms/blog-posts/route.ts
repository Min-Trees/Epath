import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { BlogPostSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.blogPosts)
export const POST = makeCreateHandler({
  name: CollectionNames.blogPosts,
  schema: BlogPostSchema,
})
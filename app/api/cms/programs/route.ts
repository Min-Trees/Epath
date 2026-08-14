import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { ProgramSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.programs)
export const POST = makeCreateHandler({ name: CollectionNames.programs, schema: ProgramSchema })
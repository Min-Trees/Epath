import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { StatisticSchema } from '@/lib/cms-types'
import { CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.statistics)
export const POST = makeCreateHandler({ name: CollectionNames.statistics, schema: StatisticSchema })

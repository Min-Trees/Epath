import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { StatisticSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.statistics, schema: StatisticSchema })
export const DELETE = makeDeleteHandler(CollectionNames.statistics)

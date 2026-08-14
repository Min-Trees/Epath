import {
  makeListHandler,
  makeCreateHandler,
  makeUpdateHandler,
  makeDeleteHandler,
  makeReorderHandler,
} from '@/lib/cms-handlers'
import { AdmissionStepSchema, CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.admissionSteps)
export const POST = makeCreateHandler({
  name: CollectionNames.admissionSteps,
  schema: AdmissionStepSchema,
})
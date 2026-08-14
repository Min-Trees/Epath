import { makeUpdateHandler, makeDeleteHandler } from '@/lib/cms-handlers'
import { AdmissionStepSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({
  name: CollectionNames.admissionSteps,
  schema: AdmissionStepSchema,
})
export const DELETE = makeDeleteHandler(CollectionNames.admissionSteps)
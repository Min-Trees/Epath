import { makeReorderHandler } from '@/lib/cms-handlers'
import { CollectionNames } from '@/lib/cms-types'

export const POST = makeReorderHandler(CollectionNames.admissionSteps)
import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { SiteSettingsSchema, CollectionNames } from '@/lib/cms-types'

export const PATCH = makeUpdateHandler({ name: CollectionNames.siteSettings, schema: SiteSettingsSchema })
export const DELETE = makeDeleteHandler(CollectionNames.siteSettings)

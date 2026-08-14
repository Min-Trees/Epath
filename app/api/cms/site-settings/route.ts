import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { SiteSettingsSchema } from '@/lib/cms-types'
import { CollectionNames } from '@/lib/cms-types'

export const GET = makeListHandler(CollectionNames.siteSettings)
export const POST = makeCreateHandler({ name: CollectionNames.siteSettings, schema: SiteSettingsSchema })

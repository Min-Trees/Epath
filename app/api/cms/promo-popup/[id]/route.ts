import {
  makeUpdateHandler,
  makeDeleteHandler,
} from '@/lib/cms-handlers'
import { PromoPopupSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = makeUpdateHandler({ name: CollectionNames.promoPopup, schema: PromoPopupSchema })
export const DELETE = makeDeleteHandler(CollectionNames.promoPopup)

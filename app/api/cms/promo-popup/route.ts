import {
  makeListHandler,
  makeCreateHandler,
} from '@/lib/cms-handlers'
import { PromoPopupSchema, CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = makeListHandler(CollectionNames.promoPopup)
export const POST = makeCreateHandler({ name: CollectionNames.promoPopup, schema: PromoPopupSchema })

// Generic CRUD handlers factory for CMS collections.
import { NextRequest, NextResponse } from 'next/server'
import { z, type ZodTypeAny } from 'zod'
import { getSessionUser } from '@/lib/session'
import {
  listCollection,
  createDocument,
  updateDocument,
  deleteDocument,
  reorderCollection,
} from './cms-repo'

interface CrudConfig<T> {
  name: string
  schema: ZodTypeAny
  // Optional transformation before saving (e.g. add audit fields)
  transform?: (data: T) => Record<string, unknown>
}

export function makeListHandler(name: string) {
  return async function GET() {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const items = await listCollection<{ id: string; [k: string]: unknown }>(name)
    return NextResponse.json({ items })
  }
}

export function makeCreateHandler<T>(config: CrudConfig<T>) {
  return async function POST(req: NextRequest) {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const json = await req.json().catch(() => null)
    const parsed = config.schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const payload = config.transform
      ? config.transform(parsed.data as T)
      : (parsed.data as Record<string, unknown>)
    const id = await createDocument(config.name, payload)
    return NextResponse.json({ id })
  }
}

export function makeUpdateHandler<T>(config: CrudConfig<T>) {
  return async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const json = await req.json().catch(() => null)
    // Build a partial schema by iterating top-level keys. This works for
    // object schemas (which is all our CMS schemas are).
    const partialSchema = makePartial(config.schema)
    const parsed = partialSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const payload = config.transform
      ? (config.transform(parsed.data as T) as Record<string, unknown>)
      : (parsed.data as Record<string, unknown>)
    await updateDocument(config.name, params.id, payload)
    return NextResponse.json({ ok: true })
  }
}

function makePartial(schema: ZodTypeAny): ZodTypeAny {
  // Top-level schemas in this project are ZodObject. We unwrap and rebuild
  // each key as optional. For nested schemas we keep them as-is.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inner = (schema as any)._def
  if (inner?.typeName === 'ZodObject') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape: Record<string, ZodTypeAny> = inner.shape()
    const partialShape: Record<string, ZodTypeAny> = {}
    for (const key of Object.keys(shape)) {
      partialShape[key] = shape[key].optional()
    }
    return z.object(partialShape).passthrough()
  }
  return schema
}

export function makeDeleteHandler(name: string) {
  return async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await deleteDocument(name, params.id)
    return NextResponse.json({ ok: true })
  }
}

export function makeReorderHandler(name: string) {
  return async function POST(req: NextRequest) {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const json = await req.json().catch(() => null)
    const ids = (json as { ids?: string[] } | null)?.ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids required' }, { status: 400 })
    }
    await reorderCollection(name, ids)
    return NextResponse.json({ ok: true })
  }
}
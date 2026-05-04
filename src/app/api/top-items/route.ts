import { NextRequest, NextResponse } from 'next/server'
import { envatoGet } from '@/lib/envato'
import { generateTopItems } from '@/lib/demo'

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-envato-token') ?? undefined

  if (!token && !process.env.ENVATO_TOKEN) {
    return NextResponse.json({ items: generateTopItems(), demo: true })
  }

  try {
    const data = await envatoGet('/v3/market/catalog/items?site=themeforest.net&sort_by=sales&number=10', token)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (data.matches ?? data ?? []).slice(0, 10).map((i: any) => ({
      id: String(i.id ?? ''),
      name: i.name ?? '—',
      category: i.classification ?? i.site ?? 'ThemeForest',
      sales: i.number_of_sales ?? 0,
      revenue: (i.number_of_sales ?? 0) * parseFloat(i.prices?.[0]?.price ?? i.price ?? '0'),
      price: parseFloat(i.prices?.[0]?.price ?? i.price ?? '0'),
      rating: parseFloat(i.rating?.rating ?? '0'),
    }))
    return NextResponse.json({ items, demo: false })
  } catch {
    return NextResponse.json({ items: generateTopItems(), demo: true })
  }
}

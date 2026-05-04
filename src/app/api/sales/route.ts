import { NextRequest, NextResponse } from 'next/server'
import { envatoGet } from '@/lib/envato'
import { generateDemoSales } from '@/lib/demo'

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-envato-token') ?? undefined

  if (!token && !process.env.ENVATO_TOKEN) {
    return NextResponse.json({ sales: generateDemoSales(120), demo: true })
  }

  try {
    const data = await envatoGet('/v3/market/author/sales', token)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sales = (data.results ?? data ?? []).map((s: any, i: number) => ({
      id: s.code ?? `sale-${i}`,
      purchaseCode: s.code ?? '',
      firstName: s.buyer ?? 'Unknown',
      lastName: '',
      email: `${s.buyer ?? 'buyer'}@envato.com`,
      item: s.item?.name ?? s.item ?? '—',
      itemId: String(s.item?.id ?? ''),
      category: s.item?.classification ?? s.item?.site ?? 'ThemeForest',
      price: parseFloat(s.amount ?? '0'),
      purchaseDate: new Date(s.sold_at ?? Date.now()).toISOString(),
      supportEnd: s.support_amount
        ? new Date(s.support_amount).toISOString()
        : new Date(Date.now() + 180 * 86400000).toISOString(),
      licenseType: s.license ?? 'Regular License',
      soldVia: 'ThemeForest',
    }))
    return NextResponse.json({ sales, demo: false })
  } catch (err) {
    const msg = (err as Error).message
    if (msg === 'NO_TOKEN') {
      return NextResponse.json({ sales: generateDemoSales(120), demo: true })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

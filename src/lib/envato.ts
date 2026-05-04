const BASE = 'https://api.envato.com'

export async function envatoGet(path: string, token?: string) {
  const t = token || process.env.ENVATO_TOKEN
  if (!t) throw new Error('NO_TOKEN')

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${t}`,
      'User-Agent':  'EnvatoDesk/1.0 (contact@envato-desk.app)',
    },
    next: { revalidate: 60 },
  })

  if (res.status === 404) throw new Error('NOT_FOUND')
  if (res.status === 401) throw new Error('INVALID_TOKEN')
  if (!res.ok) throw new Error(`API_ERROR_${res.status}`)

  return res.json()
}

export function parseSaleResponse(data: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s: any = (data as any).sale ?? data
  const purchaseDate = new Date(s.sold_at ?? s.sale_date ?? Date.now())
  // Envato provides support_amount as ISO date string when support is purchased
  const supportEnd = s.support_amount
    ? new Date(s.support_amount)
    : new Date(purchaseDate.getTime() + 180 * 86400000)

  return {
    purchaseCode: s.code ?? '',
    firstName:    s.buyer ?? 'Unknown',
    lastName:     '',
    email:        `${s.buyer}@envato.com`,
    item:         s.item?.name ?? s.item ?? '—',
    itemId:       String(s.item?.id ?? ''),
    category:     s.item?.site ?? 'ThemeForest',
    price:        parseFloat(s.amount ?? '0'),
    purchaseDate: purchaseDate.toISOString(),
    supportEnd:   supportEnd.toISOString(),
    licenseType:  s.license ?? 'Regular License',
    soldVia:      'ThemeForest',
  }
}

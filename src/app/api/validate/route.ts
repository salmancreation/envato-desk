import { NextRequest, NextResponse } from 'next/server'
import { envatoGet, parseSaleResponse } from '@/lib/envato'
import { generateDemoSales } from '@/lib/demo'

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get('code')?.trim()
  const token = req.headers.get('x-envato-token') ?? undefined

  if (!code) {
    return NextResponse.json({ error: 'Missing purchase code' }, { status: 400 })
  }

  // UUID format check
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRe.test(code)) {
    return NextResponse.json({ error: 'Invalid purchase code format' }, { status: 400 })
  }

  // Demo mode — no token configured
  if (!token && !process.env.ENVATO_TOKEN) {
    const sales = generateDemoSales(200)
    // Return a realistic demo result
    const demo = {
      purchaseCode: code,
      firstName: 'Emily',
      lastName:  'Johnson',
      email:     'emily.johnson42@gmail.com',
      item:      'Avada – Website Builder & Design Framework',
      itemId:    'item-0',
      category:  'WordPress',
      price:     69,
      purchaseDate: new Date(Date.now() - 90 * 86400000).toISOString(),
      supportEnd:   new Date(Date.now() + 90 * 86400000).toISOString(),
      licenseType: 'Regular License',
      soldVia: 'ThemeForest',
    }
    // Vary response for different codes
    if (code.startsWith('000')) {
      return NextResponse.json({ valid: false, error: 'Purchase code not found' }, { status: 404 })
    }
    void sales
    return NextResponse.json({ valid: true, sale: demo })
  }

  try {
    const data = await envatoGet(`/v3/market/author/sale?code=${encodeURIComponent(code)}`, token)
    return NextResponse.json({ valid: true, sale: parseSaleResponse(data) })
  } catch (err) {
    const msg = (err as Error).message
    if (msg === 'NOT_FOUND') {
      return NextResponse.json({ valid: false, error: 'Purchase code not found or does not belong to your account' }, { status: 404 })
    }
    if (msg === 'INVALID_TOKEN') {
      return NextResponse.json({ error: 'Invalid Envato token' }, { status: 401 })
    }
    if (msg === 'NO_TOKEN') {
      return NextResponse.json({ error: 'No Envato token configured' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Envato API error' }, { status: 500 })
  }
}

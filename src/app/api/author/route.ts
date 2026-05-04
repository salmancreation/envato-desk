import { NextRequest, NextResponse } from 'next/server'
import { envatoGet } from '@/lib/envato'

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-envato-token') ?? undefined
  if (!token && !process.env.ENVATO_TOKEN) {
    return NextResponse.json({ username: 'Demo Author', email: 'demo@example.com', country: 'US', demo: true })
  }
  try {
    const data = await envatoGet('/v1/market/private/user/account.json', token)
    return NextResponse.json(data.account ?? data)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

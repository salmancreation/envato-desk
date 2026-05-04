export interface Sale {
  id: string
  purchaseCode: string
  firstName: string
  lastName: string
  email: string
  item: string
  itemId: string
  category: string
  price: number
  purchaseDate: string
  supportEnd: string
  licenseType: string
  soldVia: string
}

export interface TopItem {
  name: string
  category: string
  sales: number
  revenue: number
  price: number
  rating: number
  id: string
}

export function fmtMoney(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + Math.round(n).toLocaleString()
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function supportStatus(iso: string): 'active' | 'expiring' | 'expired' {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff < 0) return 'expired'
  if (diff < 30 * 86_400_000) return 'expiring'
  return 'active'
}

const ITEMS = [
  { name: 'Avada – Website Builder & Design Framework', price: 69, id: 'item-0' },
  { name: 'BeTheme – Responsive Multi-Purpose WordPress', price: 59, id: 'item-1' },
  { name: 'The7 – Website & eCommerce Builder', price: 39, id: 'item-2' },
  { name: 'Flatsome | Multi-Purpose Responsive WooCommerce', price: 59, id: 'item-3' },
  { name: 'Enfold – Responsive Multi-Purpose Theme', price: 59, id: 'item-4' },
  { name: 'Bridge – Creative Multi-Purpose Theme', price: 69, id: 'item-5' },
  { name: 'Porto | Responsive & Multipurpose WordPress', price: 59, id: 'item-6' },
  { name: 'Salient – Responsive Multi-Purpose Theme', price: 59, id: 'item-7' },
  { name: 'Kalium – Creative Theme for Professionals', price: 59, id: 'item-8' },
  { name: 'Total – Versatile, Multipurpose WordPress Theme', price: 59, id: 'item-9' },
]

const FIRSTS = ['James','Emily','Oliver','Sophia','Liam','Isabella','Noah','Emma','Ava','Lucas','Mia','Ethan','Charlotte','Aiden','Amelia','Mohammed','Zara','Chen','Yuki','Maria']
const LASTS  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor','Lee','Martin','Anderson','Thompson','White']
const DOMAINS = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','protonmail.com','me.com']
const CATS   = ['WordPress','WooCommerce','HTML Templates','Joomla','Drupal']

function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export function generateDemoSales(count = 120): Sale[] {
  const now = Date.now()
  const day = 86_400_000
  return Array.from({ length: count }, (_, i) => {
    const r = (offset = 0) => seededRand(i * 17 + offset)
    const fn = FIRSTS[Math.floor(r(1) * FIRSTS.length)]
    const ln = LASTS[Math.floor(r(2) * LASTS.length)]
    const itemIdx = Math.floor(r(3) * ITEMS.length)
    const item = ITEMS[itemIdx]
    const purchaseDate = new Date(now - r(4) * 365 * day)
    const supportEnd   = new Date(purchaseDate.getTime() + 180 * day)
    const num = Math.floor(r(5) * 99) + 1
    return {
      id: `sale-${i}`,
      purchaseCode: [
        Math.floor(r(6) * 0xffffffff).toString(16).padStart(8,'0'),
        Math.floor(r(7) * 0xffff).toString(16).padStart(4,'0'),
        Math.floor(r(8) * 0xffff).toString(16).padStart(4,'0'),
        Math.floor(r(9) * 0xffff).toString(16).padStart(4,'0'),
        Math.floor(r(10) * 0xffffffffffff).toString(16).padStart(12,'0'),
      ].join('-'),
      firstName: fn,
      lastName:  ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${num}@${DOMAINS[Math.floor(r(11) * DOMAINS.length)]}`,
      item: item.name,
      itemId: item.id,
      category: CATS[Math.floor(r(12) * CATS.length)],
      price: item.price,
      purchaseDate: purchaseDate.toISOString(),
      supportEnd:   supportEnd.toISOString(),
      licenseType: r(13) > 0.9 ? 'Extended License' : 'Regular License',
      soldVia: 'ThemeForest',
    }
  })
}

export function generateTopItems(): TopItem[] {
  return [
    { id:'item-0', name:'Avada – Website Builder & Design Framework',         category:'ThemeForest / WordPress',      sales:763421, revenue:52676049, price:69,  rating:4.72 },
    { id:'item-1', name:'BeTheme – Responsive Multi-Purpose WordPress',        category:'ThemeForest / WordPress',      sales:271832, revenue:16038088, price:59,  rating:4.68 },
    { id:'item-3', name:'Flatsome | Multi-Purpose Responsive WooCommerce',     category:'ThemeForest / WooCommerce',    sales:248100, revenue:14637900, price:59,  rating:4.81 },
    { id:'item-2', name:'The7 – Website & eCommerce Builder for WordPress',    category:'ThemeForest / WordPress',      sales:148234, revenue: 5781126, price:39,  rating:4.74 },
    { id:'item-4', name:'Enfold – Responsive Multi-Purpose Theme',             category:'ThemeForest / WordPress',      sales:119600, revenue: 7056400, price:59,  rating:4.65 },
    { id:'item-5', name:'Bridge – Creative Multi-Purpose WordPress Theme',     category:'ThemeForest / WordPress',      sales:104322, revenue: 7198218, price:69,  rating:4.59 },
    { id:'item-6', name:'Porto | Responsive & Multipurpose WordPress Theme',   category:'ThemeForest / WordPress',      sales: 98100, revenue: 5787900, price:59,  rating:4.62 },
    { id:'item-7', name:'Salient – Responsive Multi-Purpose Theme',            category:'ThemeForest / WordPress',      sales: 84600, revenue: 4991400, price:59,  rating:4.77 },
    { id:'item-8', name:'Kalium – Creative Theme for Professionals',           category:'ThemeForest / WordPress',      sales: 72300, revenue: 4265700, price:59,  rating:4.85 },
    { id:'item-9', name:'Total – Versatile, Multipurpose WordPress Theme',     category:'ThemeForest / WordPress',      sales: 63800, revenue: 3764200, price:59,  rating:4.70 },
  ]
}

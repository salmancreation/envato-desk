'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  CheckCircle, XCircle, Search, Settings, AlertCircle,
  TrendingUp, Users, DollarSign, ShoppingBag, Star,
  Clock, Award, BarChart2, Package, Shield, RefreshCw,
  ChevronLeft, ChevronRight, Copy, Check, ExternalLink,
  Zap, Menu, X, Activity, Eye, EyeOff, ArrowUpRight,
  LogOut, Sun, Moon, Globe, Lock
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import { fmtMoney, fmtDate, supportStatus, type Sale, type TopItem } from '@/lib/demo'

function cn(...c: (string|boolean|undefined|null)[]) { return c.filter(Boolean).join(' ') }

function useToken() {
  const [token, setTokenState] = useState('')
  const [loaded, setLoaded]    = useState(false)
  useEffect(() => {
    try { setTokenState(localStorage.getItem('envato_token') ?? '') } catch {}
    setLoaded(true)
  }, [])
  const setToken = (v: string) => {
    setTokenState(v)
    try { localStorage.setItem('envato_token', v) } catch {}
  }
  return [token, setToken, loaded] as const
}

function apiFetch(path: string, token: string) {
  return fetch(path, { headers: token ? { 'x-envato-token': token } : {} }).then(r => r.json())
}

// ──────────────────────────────────────────────────────────────────────────────
// Badge
// ──────────────────────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; dot: string; label: string }> = {
    active:   { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500 animate-pulse', label: 'Active' },
    expiring: { cls: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-500', label: 'Expiring Soon' },
    expired:  { cls: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', dot: 'bg-red-500', label: 'Expired' },
  }
  const c = cfg[status] ?? cfg.expired
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', c.cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// StatCard
// ──────────────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent: string
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
        <span className={cn('p-2 rounded-xl', accent)}><Icon size={15} /></span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CopyButton
// ──────────────────────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600">
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// DemoAlert
// ──────────────────────────────────────────────────────────────────────────────
function DemoAlert({ onSettings }: { onSettings: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-400">
      <AlertCircle size={15} className="flex-shrink-0" />
      <span className="flex-1">Showing demo data. <button onClick={onSettings} className="underline font-medium hover:text-amber-900">Add your Envato token</button> to load real sales.</span>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// VALIDATE TAB
// ──────────────────────────────────────────────────────────────────────────────
function ValidateTab({ token, onSettings }: { token: string; onSettings: () => void }) {
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<{ valid: boolean; sale?: Sale; error?: string } | null>(null)
  const [history, setHistory] = useState<Array<{ code: string; valid: boolean; item?: string; supportEnd?: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const validate = async () => {
    const t = code.trim()
    if (!t) return
    setLoading(true); setResult(null)
    try {
      const data = await apiFetch(`/api/validate?code=${encodeURIComponent(t)}`, token)
      const r = { valid: !!data.valid, sale: data.sale, error: data.error }
      setResult(r)
      setHistory(h => [{ code: t, valid: r.valid, item: r.sale?.item, supportEnd: r.sale?.supportEnd }, ...h.slice(0, 9)])
    } catch { setResult({ valid: false, error: 'Network error. Please try again.' }) }
    finally { setLoading(false) }
  }

  const supp = result?.sale ? supportStatus(result.sale.supportEnd) : null

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Input */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <Shield size={18} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Validate Purchase Code</h2>
            <p className="text-sm text-slate-500">Verify any customer&apos;s Envato purchase in real time</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && validate()}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
            maxLength={36}
            spellCheck={false}
            autoComplete="off"
          />
          <button onClick={validate} disabled={loading || !code.trim()} className="btn-brand px-5 py-3 flex items-center gap-2 whitespace-nowrap">
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Zap size={15} />}
            {loading ? 'Checking…' : 'Validate'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Enter the 36-character UUID your customer sent you. Codes starting with <code className="code-chip">000</code> simulate invalid in demo mode.</p>
      </div>

      {/* Result */}
      {result && (
        <div className={cn('rounded-2xl overflow-hidden animate-slide-up', result.valid ? 'result-valid' : 'result-invalid')}>
          <div className={cn('flex items-center gap-3 px-6 py-4', result.valid ? 'bg-emerald-50 dark:bg-emerald-900/15' : 'bg-red-50 dark:bg-red-900/15')}>
            {result.valid
              ? <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              : <XCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />}
            <div className="flex-1">
              <p className={cn('font-semibold', result.valid ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300')}>
                {result.valid ? '✓ Valid Purchase Code' : '✗ Invalid Purchase Code'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {result.valid ? 'This purchase is legitimate and belongs to your account.' : result.error}
              </p>
            </div>
            {result.valid && supp && <Badge status={supp} />}
          </div>

          {result.valid && result.sale && (
            <div className="bg-white dark:bg-slate-900/80 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                {[
                  { label: 'First Name',    val: result.sale.firstName },
                  { label: 'Last Name',     val: result.sale.lastName || '—' },
                  { label: 'Email',         val: result.sale.email, mono: false },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">{f.label}</p>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{f.val}</p>
                  </div>
                ))}
                <div className="col-span-2 md:col-span-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Item Purchased</p>
                  <p className="font-semibold text-brand-600 dark:text-brand-400">{result.sale.item}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Price Paid</p>
                  <p className="font-bold text-xl text-slate-900 dark:text-white">${result.sale.price}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">License</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{result.sale.licenseType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Purchase Date</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{fmtDate(result.sale.purchaseDate)}</p>
                </div>
                <div className="col-span-2 md:col-span-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Support Status</p>
                      <div className="flex items-center gap-2">
                        <Badge status={supp!} />
                        <span className="text-sm text-slate-500">ends {fmtDate(result.sale.supportEnd)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Purchase Code</p>
                      <div className="flex items-center gap-1">
                        <code className="code-chip">{result.sale.purchaseCode}</code>
                        <CopyButton text={result.sale.purchaseCode} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm animate-fade-in">
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <h3 className="font-medium text-sm">Recent Validations</h3>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">{history.length}</span>
            </div>
            <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Clear all</button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                {h.valid ? <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" /> : <XCircle size={13} className="text-red-400 flex-shrink-0" />}
                <code className="text-xs font-mono text-slate-400 flex-1 truncate">{h.code}</code>
                <span className="text-xs text-slate-500 truncate max-w-[160px] hidden sm:block">{h.item ?? 'Not found'}</span>
                {h.valid && h.supportEnd && <Badge status={supportStatus(h.supportEnd)} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {!token && (
        <div className="bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-4 flex items-start gap-3">
          <Lock size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-300">Demo Mode Active</p>
            <p className="text-blue-600 dark:text-blue-400 mt-0.5">All validations use simulated data. <button onClick={onSettings} className="underline">Add your token</button> to validate real purchases.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SALES TAB
// ──────────────────────────────────────────────────────────────────────────────
function SalesTab({ token, onSettings }: { token: string; onSettings: () => void }) {
  const [sales, setSales]         = useState<Sale[]>([])
  const [filtered, setFiltered]   = useState<Sale[]>([])
  const [loading, setLoading]     = useState(true)
  const [query, setQuery]         = useState('')
  const [page, setPage]           = useState(1)
  const [isDemo, setIsDemo]       = useState(false)
  const [sortCol, setSortCol]     = useState<'purchaseDate'|'price'|'supportEnd'>('purchaseDate')
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('desc')
  const PER = 12

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch('/api/sales', token)
      setSales(data.sales ?? []); setFiltered(data.sales ?? []); setIsDemo(!!data.demo)
    } catch {}
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const q = query.toLowerCase()
    let res = q ? sales.filter(s => [s.firstName,s.lastName,s.email,s.item,s.purchaseCode].join(' ').toLowerCase().includes(q)) : [...sales]
    res = res.sort((a,b) => {
      const va = sortCol === 'price' ? a[sortCol] : new Date(a[sortCol]).getTime()
      const vb = sortCol === 'price' ? b[sortCol] : new Date(b[sortCol]).getTime()
      return sortDir === 'desc' ? (vb as number) - (va as number) : (va as number) - (vb as number)
    })
    setFiltered(res); setPage(1)
  }, [query, sales, sortCol, sortDir])

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const totalPages = Math.ceil(filtered.length / PER)
  const pageSales  = filtered.slice((page-1)*PER, page*PER)
  const totalRev   = sales.reduce((s,x) => s+x.price, 0)
  const now        = new Date()
  const thisMonth  = sales.filter(s => new Date(s.purchaseDate) >= new Date(now.getFullYear(),now.getMonth(),1)).length
  const buyers     = new Set(sales.map(s=>s.email)).size

  const SortBtn = ({ col, label }: { col: typeof sortCol; label: string }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 text-left text-xs font-medium text-slate-500 uppercase tracking-wide group">
      {label}
      <span className={cn('transition-opacity', sortCol===col ? 'opacity-100' : 'opacity-0 group-hover:opacity-50')}>
        {sortDir==='desc' ? '↓' : '↑'}
      </span>
    </button>
  )

  return (
    <div className="space-y-5">
      {isDemo && <DemoAlert onSettings={onSettings} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard icon={ShoppingBag} label="Total Sales"    value={sales.length.toLocaleString()} sub="all time"         accent="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" />
        <StatCard icon={DollarSign}  label="Gross Revenue"  value={fmtMoney(totalRev)} sub="USD total"            accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
        <StatCard icon={TrendingUp}  label="This Month"     value={String(thisMonth)} sub="new sales"             accent="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
        <StatCard icon={Users}       label="Unique Buyers"  value={buyers.toLocaleString()} sub="total customers" accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 gap-3 flex-wrap">
          <h3 className="font-semibold text-slate-900 dark:text-white">Sales Transactions</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search buyer, item, code…"
                className="pl-8 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 w-52 focus:outline-none" />
            </div>
            <button onClick={load} title="Refresh"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500">
              <RefreshCw size={13} className={loading ? 'animate-spin text-brand-600' : ''} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({length:6}).map((_,i) => <div key={i} className="skeleton h-10 rounded-lg" />)}
            </div>
          ) : pageSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ShoppingBag size={36} className="mb-3 opacity-20" />
              <p className="text-sm">No sales found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                  <th className="px-5 py-3 text-left"><span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Purchase Code</span></th>
                  <th className="px-4 py-3 text-left"><span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Buyer</span></th>
                  <th className="px-4 py-3 text-left"><span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</span></th>
                  <th className="px-4 py-3 text-left"><span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Item</span></th>
                  <th className="px-4 py-3 text-left"><SortBtn col="price" label="Price" /></th>
                  <th className="px-4 py-3 text-left"><SortBtn col="purchaseDate" label="Purchased" /></th>
                  <th className="px-4 py-3 text-left"><SortBtn col="supportEnd" label="Support" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {pageSales.map(sale => {
                  const supp = supportStatus(sale.supportEnd)
                  return (
                    <tr key={sale.id} className="tr-hover transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <code className="code-chip">{sale.purchaseCode.substring(0,13)}…</code>
                          <CopyButton text={sale.purchaseCode} />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {sale.firstName} {sale.lastName}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate text-xs">{sale.email}</td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="truncate font-medium text-slate-800 dark:text-slate-200">{sale.item}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{sale.category}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400 whitespace-nowrap">${sale.price}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(sale.purchaseDate)}</td>
                      <td className="px-4 py-3">
                        <Badge status={supp} />
                        <p className="text-xs text-slate-400 mt-1">{fmtDate(sale.supportEnd)}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500">
            <span className="text-xs">Showing {(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of <strong>{filtered.length}</strong></span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                const n = Math.max(1,Math.min(totalPages-4,page-2))+i
                return (
                  <button key={n} onClick={()=>setPage(n)}
                    className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-colors', n===page ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800')}>
                    {n}
                  </button>
                )
              })}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TOP ITEMS TAB
// ──────────────────────────────────────────────────────────────────────────────
function TopItemsTab({ token, onSettings }: { token: string; onSettings: () => void }) {
  const [items, setItems]     = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo]   = useState(false)

  useEffect(() => {
    apiFetch('/api/top-items', token)
      .then(d => { setItems(d.items ?? []); setIsDemo(!!d.demo) })
      .finally(() => setLoading(false))
  }, [token])

  const max = items[0]?.sales ?? 1
  const RANK_COLORS = ['bg-amber-400','bg-slate-300','bg-amber-600','bg-slate-200']

  return (
    <div className="space-y-5">
      {isDemo && <DemoAlert onSettings={onSettings} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <Award size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Top 10 Selling Items</h2>
            <p className="text-sm text-slate-500">Your best-performing ThemeForest products</p>
          </div>
        </div>
        <div className="text-xs text-slate-400">Updated {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-4 p-6">
            {Array.from({length:10}).map((_,i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {items.map((item, i) => {
              const pct = Math.round(item.sales/max*100)
              const initials = item.name.split(' ').slice(0,2).map((w:string)=>w[0]).join('').toUpperCase()
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors animate-fade-in" style={{animationDelay:`${i*35}ms`}}>
                  {/* Rank */}
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white', i<3 ? RANK_COLORS[i] : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}>
                    {i+1}
                  </div>
                  {/* Thumb */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/20 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-sm flex-shrink-0 border border-brand-200 dark:border-brand-800/30">
                    {initials}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                    <div className="mt-2.5 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-full max-w-xs">
                      <div className="h-full bg-brand-500 rounded-full bar-animate" style={{width:`${pct}%`}} />
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="text-right flex-shrink-0 space-y-1 ml-2">
                    <p className="font-bold text-xl text-slate-900 dark:text-white">{item.sales.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{fmtMoney(item.revenue)} revenue</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="flex items-center gap-0.5 text-xs font-medium text-amber-600">
                        <Star size={11} className="fill-amber-400 text-amber-400" />{item.rating.toFixed(2)}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">${item.price}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ANALYTICS TAB
// ──────────────────────────────────────────────────────────────────────────────
function AnalyticsTab({ token, onSettings }: { token: string; onSettings: () => void }) {
  const [sales, setSales]   = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    apiFetch('/api/sales', token)
      .then(d => { setSales(d.sales ?? []); setIsDemo(!!d.demo) })
      .finally(() => setLoading(false))
  }, [token])

  const now = new Date()
  const monthlyData = Array.from({length:7},(_,i) => {
    const d = new Date(now.getFullYear(), now.getMonth()-6+i, 1)
    const label = d.toLocaleDateString('en-US',{month:'short'})
    const m = sales.filter(s => {
      const pd = new Date(s.purchaseDate)
      return pd.getFullYear()===d.getFullYear() && pd.getMonth()===d.getMonth()
    })
    return { label, revenue: m.reduce((s,x)=>s+x.price,0), sales: m.length }
  })

  const catMap: Record<string,number> = {}
  sales.forEach(s => { catMap[s.category]=(catMap[s.category]??0)+1 })
  const catData = Object.entries(catMap).map(([name,value])=>({name,value}))

  const suppData = [
    { name:'Active',   value: sales.filter(s=>supportStatus(s.supportEnd)==='active').length,   fill:'#00b779' },
    { name:'Expiring', value: sales.filter(s=>supportStatus(s.supportEnd)==='expiring').length, fill:'#f59e0b' },
    { name:'Expired',  value: sales.filter(s=>supportStatus(s.supportEnd)==='expired').length,  fill:'#ef4444' },
  ]

  const avgSale  = sales.length ? Math.round(sales.reduce((s,x)=>s+x.price,0)/sales.length) : 0
  const totalRev = sales.reduce((s,x)=>s+x.price,0)
  const COLORS   = ['#00b779','#378add','#ef9f27','#d4537e','#7f77dd','#10b981']
  const tooltipStyle = { backgroundColor:'#0f172a', border:'1px solid #1e293b', borderRadius:'10px', fontSize:'12px', color:'#e2e8f0' }

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-5">
      {isDemo && <DemoAlert onSettings={onSettings} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard icon={DollarSign}  label="Total Revenue"   value={fmtMoney(totalRev)} sub="gross"              accent="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" />
        <StatCard icon={BarChart2}   label="Avg Sale Value"  value={`$${avgSale}`}      sub="per transaction"    accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
        <StatCard icon={Shield}      label="Support Active"  value={`${suppData[0].value}`} sub={`${Math.round(suppData[0].value/(sales.length||1)*100)}% of buyers`} accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
        <StatCard icon={Package}     label="Total Sales"     value={sales.length.toLocaleString()} sub="all time" accent="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
      </div>

      {/* Revenue area chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">Revenue & Sales Trend</h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-500 inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />Sales</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-5">Last 7 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b779" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#00b779" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="salGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.1)" />
            <XAxis dataKey="label" tick={{fontSize:12,fill:'#64748b'}} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" tick={{fontSize:11,fill:'#64748b'}} axisLine={false} tickLine={false} tickFormatter={v=>fmtMoney(v)} />
            <YAxis yAxisId="cnt" orientation="right" tick={{fontSize:11,fill:'#64748b'}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v,n)=>n==='revenue'?[fmtMoney(Number(v)),'Revenue']:[v,'Sales']} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#00b779" strokeWidth={2.5} fill="url(#revGrad)" name="revenue" dot={{fill:'#00b779',r:4,strokeWidth:0}} activeDot={{r:6}} />
            <Area yAxisId="cnt" type="monotone" dataKey="sales"   stroke="#60a5fa" strokeWidth={2}   fill="url(#salGrad)" name="sales"   dot={{fill:'#60a5fa',r:3,strokeWidth:0}} activeDot={{r:5}} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">Sales by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Distribution across marketplaces</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {catData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} formatter={v=><span style={{fontSize:12,color:'#94a3b8'}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">Support Status</h3>
          <p className="text-xs text-slate-400 mb-4">Active, expiring and expired support</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={suppData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {suppData.map((e,i)=><Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} formatter={v=><span style={{fontSize:12,color:'#94a3b8'}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ──────────────────────────────────────────────────────────────────────────────
function SettingsTab({ token, setToken }: { token: string; setToken: (v:string)=>void }) {
  const [input, setInput]     = useState(token)
  const [show, setShow]       = useState(false)
  const [saved, setSaved]     = useState(false)
  const [author, setAuthor]   = useState<Record<string,unknown>|null>(null)
  const [dark, setDark]       = useState(false)

  useEffect(() => { setDark(document.documentElement.classList.contains('dark')) }, [])
  useEffect(() => { if (token) apiFetch('/api/author',token).then(d=>setAuthor(d)) }, [token])

  const toggleDark = () => { document.documentElement.classList.toggle('dark'); setDark(d=>!d) }
  const save = () => { setToken(input); setSaved(true); setTimeout(()=>setSaved(false),2000) }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Author card */}
      {author && !('error' in author) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/20 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-2xl border border-brand-200 dark:border-brand-800/30">
              {String(author.username??'A')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-slate-900 dark:text-white">{String(author.username??'Author')}</p>
              <p className="text-sm text-slate-500">{String(author.email??'')}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={11}/> Connected
                </span>
                {author.country ? (
                  <span className="flex items-center gap-1 text-xs text-slate-500"><Globe size={11}/>{String(author.country)}</span>
                ) : null}
              </div>
            </div>
            <button onClick={()=>{setToken('');setAuthor(null)}} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <LogOut size={12}/> Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Token */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <Shield size={16} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Envato Personal Token</h3>
            <p className="text-xs text-slate-400">Required to access your real Envato sales data</p>
          </div>
        </div>
        <div className="relative mb-2">
          <input
            type={show ? 'text' : 'password'}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&save()}
            placeholder="Paste your Envato Personal Token here…"
            className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button onClick={()=>setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Get your free token at{' '}
          <a href="https://build.envato.com/create-token/" target="_blank" rel="noopener" className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1">
            build.envato.com/create-token/ <ExternalLink size={10}/>
          </a>
          <br/>Required scopes: <strong>View and search Envato sites</strong>, <strong>View your sales</strong>, <strong>Verify purchases you&apos;ve made</strong>.
        </p>
        <button onClick={save} className="btn-brand px-5 py-2.5 flex items-center gap-2">
          {saved ? <><Check size={14}/> Token Saved!</> : 'Save Token'}
        </button>
      </div>

      {/* OAuth */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Sign In Options</h3>
        <p className="text-sm text-slate-400 mb-4">Connect your Envato account using OAuth for team access</p>
        <div className="space-y-2.5">
          {[
            { label:'Continue with Google',  hint:'OAuth 2.0 via Google',  icon:<svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg> },
            { label:'Continue with Envato',  hint:'via Envato OAuth API',   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="#82b540"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 4l8 8-8 8-8-8 8-8z"/></svg> },
            { label:'Continue with Email',   hint:'Magic link or password',  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg> },
          ].map(opt => (
            <button key={opt.label} onClick={()=>alert('Configure OAuth provider in your .env.local — see README.md for setup instructions.')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">{opt.icon}</span>
              <div className="text-left flex-1">
                <p className="font-medium">{opt.label}</p>
                <p className="text-xs text-slate-400 font-normal">{opt.hint}</p>
              </div>
              <ArrowUpRight size={14} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dark ? <Moon size={16} className="text-slate-400"/> : <Sun size={16} className="text-amber-500"/>}
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark Mode</p>
              <p className="text-xs text-slate-400">Switch between light and dark theme</p>
            </div>
          </div>
          <button onClick={toggleDark} className={cn('toggle', dark?'bg-brand-500':'bg-slate-200 dark:bg-slate-700')}>
            <span className={cn('toggle-thumb', dark?'on':'')} />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-600 dark:text-slate-300">EnvatoDesk v1.0.0</p>
        <p>Built with Next.js 14 · Deployed on Vercel · Open source</p>
        <div className="flex items-center gap-3 pt-1">
          <a href="https://github.com" target="_blank" rel="noopener" className="text-brand-600 dark:text-brand-400 hover:underline">GitHub</a>
          <span>·</span>
          <a href="https://build.envato.com" target="_blank" rel="noopener" className="text-brand-600 dark:text-brand-400 hover:underline">Envato API Docs</a>
          <span>·</span>
          <a href="https://vercel.com" target="_blank" rel="noopener" className="text-brand-600 dark:text-brand-400 hover:underline">Vercel</a>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'validate',  label:'Validate',  icon:Shield,     desc:'Verify purchase codes' },
  { id:'sales',     label:'Sales',     icon:ShoppingBag,desc:'Browse all transactions' },
  { id:'top-items', label:'Top Items', icon:Award,      desc:'Best-selling products' },
  { id:'analytics', label:'Analytics', icon:BarChart2,  desc:'Revenue & trends' },
  { id:'settings',  label:'Settings',  icon:Settings,   desc:'Token & preferences' },
]

export default function App() {
  const [tab, setTab]               = useState('validate')
  const [token, setToken, loaded]   = useToken()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!loaded) return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center animate-pulse">
          <Zap size={20} className="text-white" />
        </div>
        <p className="text-sm text-slate-400">Loading EnvatoDesk…</p>
      </div>
    </div>
  )

  const goSettings = () => { setTab('settings'); setSidebarOpen(false) }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar – desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-brand flex-shrink-0">
            <Zap size={17} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">EnvatoDesk</p>
            <p className="text-xs text-slate-400">Author Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={cn('sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all', tab===t.id ? 'active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800')}>
              <t.icon size={16} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{t.label}</p>
              </div>
              {t.id==='top-items' && (
                <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-medium">10</span>
              )}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-xl', token ? 'bg-brand-50 dark:bg-brand-900/15' : 'bg-amber-50 dark:bg-amber-900/10')}>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', token ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400')}>
              {token ? 'A' : '!'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{token ? 'Author' : 'Demo Mode'}</p>
              <p className="text-xs text-slate-400 truncate">{token ? 'Token configured' : 'No token set'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center"><Zap size={15} className="text-white"/></div>
                <p className="font-bold text-sm">EnvatoDesk</p>
              </div>
              <button onClick={()=>setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} className="text-slate-400"/></button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>{setTab(t.id);setSidebarOpen(false)}}
                  className={cn('sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left', tab===t.id ? 'active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800')}>
                  <t.icon size={16}/>{t.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center px-5 gap-4">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={()=>setSidebarOpen(true)}>
            <Menu size={18} className="text-slate-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-slate-900 dark:text-white">{TABS.find(t=>t.id===tab)?.label}</h1>
            <p className="text-xs text-slate-400 hidden sm:block">{TABS.find(t=>t.id===tab)?.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            {!token && (
              <button onClick={goSettings}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium">
                <AlertCircle size={11}/> Add Envato token
              </button>
            )}
            {token && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Activity size={11}/> Live
              </span>
            )}
            <a href="https://themeforest.net" target="_blank" rel="noopener"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600">
              <ExternalLink size={15}/>
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-6 max-w-5xl w-full">
          {tab==='validate'  && <ValidateTab  token={token} onSettings={goSettings} />}
          {tab==='sales'     && <SalesTab     token={token} onSettings={goSettings} />}
          {tab==='top-items' && <TopItemsTab  token={token} onSettings={goSettings} />}
          {tab==='analytics' && <AnalyticsTab token={token} onSettings={goSettings} />}
          {tab==='settings'  && <SettingsTab  token={token} setToken={setToken} />}
        </main>
      </div>
    </div>
  )
}

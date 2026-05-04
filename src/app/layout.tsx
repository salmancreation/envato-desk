import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'EnvatoDesk — Purchase Validator & Sales Dashboard',
  description: 'Validate Envato purchase codes instantly. Track sales, monitor support status, and analyze your ThemeForest portfolio.',
  keywords: 'envato, themeforest, purchase code validator, sales dashboard, author tools, codecanyon',
  openGraph: {
    title: 'EnvatoDesk — Envato Author Dashboard',
    description: 'Validate purchase codes & track your Envato sales',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%2300b779'/><path d='M25 50l15-15 15 15 20-20' stroke='white' strokeWidth='8' fill='none' strokeLinecap='round' strokeLinejoin='round'/></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#00b779" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}

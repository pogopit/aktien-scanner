import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Day Trading Scanner - Stock Screener',
  description: 'Real-time day trading scanner with advanced filtering criteria for small cap stocks',
  keywords: ['day trading', 'stock scanner', 'screener', 'small cap', 'trading'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}

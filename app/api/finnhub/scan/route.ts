/**
 * API Route: POST /api/finnhub/scan
 * Scans stocks matching criteria using Finnhub data
 * 
 * Request body:
 * {
 *   "tickers": ["AAPL", "MSFT", "GOOGL", ...]
 * }
 */

import { NextResponse } from 'next/server'
import { scanStocksFromFinnhub } from '@/lib/finnhubMarketData'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tickers } = body

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'Tickers array required in request body' },
        { status: 400 }
      )
    }

    const stocks = await scanStocksFromFinnhub(tickers)

    return NextResponse.json({
      stocks,
      totalScanned: tickers.length,
      totalMatching: stocks.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to scan stocks',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

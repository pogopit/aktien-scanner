/**
 * API Route: GET /api/finnhub/quote?ticker=AAPL
 * Fetches real-time quote from Finnhub
 */

import { NextResponse } from 'next/server'
import { fetchStockFromFinnhub } from '@/lib/finnhubMarketData'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker parameter required' },
        { status: 400 }
      )
    }

    const stock = await fetchStockFromFinnhub(ticker)

    if (!stock) {
      return NextResponse.json(
        { error: `Failed to fetch quote for ${ticker}` },
        { status: 404 }
      )
    }

    return NextResponse.json(stock)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * API Route: GET /api/ib/quote?ticker=AAPL
 * Fetches real-time quote from Interactive Brokers
 */

import { NextResponse } from 'next/server'

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

    // Placeholder response - would connect to actual IB API
    return NextResponse.json({
      symbol: ticker,
      price: 100.0,
      bid: 99.95,
      ask: 100.05,
      volume: 1000000,
      lastVolume: 50000,
      lastPrice: 100.0,
      open: 99.0,
      high: 101.0,
      low: 98.5,
      close: 99.5,
      change: 1.0,
      changePercent: 1.01,
      timestamp: Date.now(),
      note: 'Placeholder data - connect to actual IB API',
    })
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

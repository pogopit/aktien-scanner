/**
 * API Route: GET /api/ib/top-gainers
 * Fetches top gainers from Interactive Brokers
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Placeholder response - would fetch actual top gainers from IB
    const topGainers = [
      {
        symbol: 'VERO',
        price: 6.72,
        bid: 6.70,
        ask: 6.75,
        volume: 308900000,
        lastVolume: 10000000,
        lastPrice: 6.72,
        open: 1.5,
        high: 7.2,
        low: 1.5,
        close: 1.8,
        change: 4.92,
        changePercent: 385.13,
        timestamp: Date.now(),
      },
      {
        symbol: 'JFRB',
        price: 1.12,
        bid: 1.10,
        ask: 1.15,
        volume: 235100000,
        lastVolume: 8000000,
        lastPrice: 1.12,
        open: 0.56,
        high: 1.25,
        low: 0.56,
        close: 0.56,
        change: 0.56,
        changePercent: 112.82,
        timestamp: Date.now(),
      },
    ]

    return NextResponse.json(topGainers)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch top gainers',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

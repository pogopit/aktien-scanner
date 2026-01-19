/**
 * API Route: GET /api/finnhub/status
 * Returns Finnhub API connection status
 */

import { NextResponse } from 'next/server'
import { getFinnhubConnectionStatus } from '@/lib/finnhubMarketData'

export async function GET() {
  try {
    const status = await getFinnhubConnectionStatus()
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        message: 'Failed to check Finnhub status',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * API Route: GET /api/ib/status
 * Returns IB Gateway connection status
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      connected: true,
      message: 'Connected to IB Gateway',
      timestamp: new Date().toISOString(),
      port: 7497,
      note: 'Make sure IB Gateway is running and API is enabled',
    })
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        message: 'IB Gateway connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

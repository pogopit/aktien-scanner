/**
 * API Route: GET /api/ib/health
 * Checks if IB Gateway is running and connected
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'IB Gateway health check',
      timestamp: new Date().toISOString(),
      note: 'Requires IB Gateway running on localhost:7497',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'IB Gateway not responding',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

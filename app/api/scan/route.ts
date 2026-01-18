/**
 * API Route: GET /api/scan
 * Returns filtered stocks based on scan criteria
 * 
 * In production, this would:
 * - Connect to a real market data API (Alpha Vantage, Finnhub, etc.)
 * - Apply the scan criteria to real-time data
 * - Cache results for performance
 * - Handle errors gracefully
 */

import { NextResponse } from 'next/server'
import { getScanResults } from '@/lib/mockData'

export async function GET() {
  try {
    // Get scan results (currently using mock data)
    const results = getScanResults()

    // Return JSON response
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Scan API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scan results' },
      { status: 500 }
    )
  }
}

/**
 * API Route: POST /api/scan
 * Allows custom scan criteria
 * 
 * Request body:
 * {
 *   "minPrice": 1.0,
 *   "maxPrice": 20.0,
 *   "minDayGain": 10,
 *   "maxSevenDayChange": 10,
 *   "minRelativeVolume": 5,
 *   "minDayVolume": 100000
 * }
 */

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // In production, apply custom criteria to real data
    // For now, return default results
    const results = getScanResults()

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Scan API error:', error)
    return NextResponse.json(
      { error: 'Failed to process scan request' },
      { status: 500 }
    )
  }
}

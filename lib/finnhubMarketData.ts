/**
 * Finnhub Market Data Integration
 * Real-time stock data from Finnhub API
 * 
 * Setup:
 * 1. Go to https://finnhub.io
 * 2. Sign up (free account)
 * 3. Get your API key
 * 4. Add to .env.local: FINNHUB_API_KEY=your_key_here
 */

import type { Stock } from './types'
import { DEFAULT_CRITERIA, filterStocks } from './mockData'

/**
 * Finnhub API Configuration
 */
export const FINNHUB_CONFIG = {
  baseUrl: 'https://finnhub.io/api/v1',
  apiKey: process.env.FINNHUB_API_KEY || '',
}

/**
 * Finnhub Quote Response
 */
interface FinnhubQuote {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High price of the day
  l: number // Low price of the day
  o: number // Open price of the day
  pc: number // Previous close price
  t: number // Unix timestamp
}

/**
 * Fetch real-time quote from Finnhub
 * 
 * @param ticker - Stock ticker symbol
 * @returns Stock data or null if fetch fails
 */
export async function fetchStockFromFinnhub(ticker: string): Promise<Stock | null> {
  try {
    if (!FINNHUB_CONFIG.apiKey) {
      console.error('FINNHUB_API_KEY not set in environment variables')
      return null
    }

    const url = `${FINNHUB_CONFIG.baseUrl}/quote?symbol=${ticker}&token=${FINNHUB_CONFIG.apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      console.error(`Failed to fetch ${ticker} from Finnhub:`, response.statusText)
      return null
    }

    const data: FinnhubQuote = await response.json()

    // Calculate day gain percentage
    const dayGain = data.dp || 0

    // Create Stock object from Finnhub data
    const stock: Stock = {
      ticker: ticker,
      companyName: ticker, // Would need company profile endpoint for full name
      exchange: 'NASDAQ', // Would need to determine from company profile
      price: data.c,
      dayGain: dayGain,
      volume: 0, // Finnhub quote doesn't include volume, need separate call
      avgVolume: 0,
      relativeVolume: 0,
      float: 0,
      sevenDayChange: 0,
      lastHOD: data.h,
      preMarketGain: 0,
      timestamp: new Date(data.t * 1000).toISOString(),
    }

    return stock
  } catch (error) {
    console.error(`Error fetching ${ticker} from Finnhub:`, error)
    return null
  }
}

/**
 * Fetch company profile from Finnhub
 * Includes company name, exchange, and other details
 */
export async function fetchCompanyProfile(ticker: string): Promise<any> {
  try {
    if (!FINNHUB_CONFIG.apiKey) {
      return null
    }

    const url = `${FINNHUB_CONFIG.baseUrl}/stock/profile2?symbol=${ticker}&token=${FINNHUB_CONFIG.apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching company profile for ${ticker}:`, error)
    return null
  }
}

/**
 * Fetch intraday candles (includes volume data)
 */
export async function fetchIntradayData(ticker: string): Promise<any> {
  try {
    if (!FINNHUB_CONFIG.apiKey) {
      return null
    }

    const url = `${FINNHUB_CONFIG.baseUrl}/stock/candle?symbol=${ticker}&resolution=1&from=${Math.floor(Date.now() / 1000) - 86400}&to=${Math.floor(Date.now() / 1000)}&token=${FINNHUB_CONFIG.apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching intraday data for ${ticker}:`, error)
    return null
  }
}

/**
 * Get top gainers from Finnhub
 * Returns list of stocks with highest gains
 */
export async function getTopGainersFromFinnhub(): Promise<Stock[]> {
  try {
    if (!FINNHUB_CONFIG.apiKey) {
      console.error('FINNHUB_API_KEY not set')
      return []
    }

    // Finnhub doesn't have a direct "top gainers" endpoint
    // We would need to scan a list of popular stocks
    // For now, return empty array - would need custom implementation
    console.log('Top gainers endpoint requires custom implementation')
    return []
  } catch (error) {
    console.error('Error getting top gainers from Finnhub:', error)
    return []
  }
}

/**
 * Scan stocks matching criteria
 * Requires a list of tickers to scan
 */
export async function scanStocksFromFinnhub(tickers: string[]): Promise<Stock[]> {
  try {
    if (!FINNHUB_CONFIG.apiKey) {
      console.error('FINNHUB_API_KEY not set')
      return []
    }

    const stocks: Stock[] = []

    // Fetch data for each ticker
    for (const ticker of tickers) {
      const quote = await fetchStockFromFinnhub(ticker)
      const profile = await fetchCompanyProfile(ticker)
      const intraday = await fetchIntradayData(ticker)

      if (quote && profile && intraday) {
        // Combine data from multiple endpoints
        const totalVolume = intraday.v ? intraday.v[intraday.v.length - 1] : 0
        const avgVolume = intraday.v ? intraday.v.reduce((a: number, b: number) => a + b) / intraday.v.length : 0

        const stock: Stock = {
          ...quote,
          companyName: profile.name || ticker,
          exchange: profile.exchange || 'NASDAQ',
          volume: totalVolume,
          avgVolume: avgVolume,
          relativeVolume: avgVolume > 0 ? totalVolume / avgVolume : 0,
          float: profile.shareOutstanding ? profile.shareOutstanding / 1000000 : 0,
        }

        stocks.push(stock)
      }

      // Rate limiting: Finnhub free tier allows 60 calls/minute
      // Add small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Apply scan criteria filters
    const filtered = filterStocks(stocks, DEFAULT_CRITERIA)

    return filtered
  } catch (error) {
    console.error('Error scanning stocks from Finnhub:', error)
    return []
  }
}

/**
 * Real-time stock monitoring with Finnhub
 */
export class FinnhubStockMonitor {
  private watchlist: Set<string> = new Set()
  private updateInterval: NodeJS.Timeout | null = null
  private onUpdate: ((stocks: Stock[]) => void) | null = null

  /**
   * Start monitoring stocks
   */
  start(tickers: string[], onUpdate: (stocks: Stock[]) => void, intervalMs: number = 300000) {
    this.watchlist = new Set(tickers)
    this.onUpdate = onUpdate

    // Initial scan
    this.scan()

    // Periodic scans (default: every 5 minutes)
    this.updateInterval = setInterval(() => {
      this.scan()
    }, intervalMs)
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  /**
   * Perform scan
   */
  private async scan() {
    try {
      const tickers = Array.from(this.watchlist)
      const stocks = await scanStocksFromFinnhub(tickers)

      if (this.onUpdate) {
        this.onUpdate(stocks)
      }

      console.log(`[Finnhub Scanner] Found ${stocks.length} stocks matching criteria`)
      stocks.forEach((stock) => {
        console.log(`  ${stock.ticker}: +${stock.dayGain.toFixed(2)}% (${stock.volume} shares)`)
      })
    } catch (error) {
      console.error('[Finnhub Scanner] Error during scan:', error)
    }
  }

  /**
   * Add stock to watchlist
   */
  addToWatchlist(ticker: string) {
    this.watchlist.add(ticker)
  }

  /**
   * Remove stock from watchlist
   */
  removeFromWatchlist(ticker: string) {
    this.watchlist.delete(ticker)
  }

  /**
   * Get watchlist
   */
  getWatchlist(): string[] {
    return Array.from(this.watchlist)
  }
}

/**
 * Check Finnhub API connection
 */
export async function checkFinnhubConnection(): Promise<boolean> {
  try {
    if (!FINNHUB_CONFIG.apiKey) {
      console.error('FINNHUB_API_KEY not set')
      return false
    }

    // Test with a simple quote request
    const response = await fetch(
      `${FINNHUB_CONFIG.baseUrl}/quote?symbol=AAPL&token=${FINNHUB_CONFIG.apiKey}`
    )
    return response.ok
  } catch (error) {
    console.error('Finnhub connection check failed:', error)
    return false
  }
}

/**
 * Get Finnhub connection status
 */
export async function getFinnhubConnectionStatus(): Promise<{
  connected: boolean
  message: string
  timestamp: string
}> {
  try {
    const connected = await checkFinnhubConnection()

    return {
      connected,
      message: connected ? 'Connected to Finnhub API' : 'Finnhub API not responding',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      connected: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
    }
  }
}

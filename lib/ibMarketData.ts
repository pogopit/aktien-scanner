/**
 * Interactive Brokers Market Data Integration
 * Fetches real-time stock data from IB and applies scan criteria
 */

import type { Stock } from './types'
import { DEFAULT_CRITERIA, filterStocks } from './mockData'

/**
 * Configuration for Interactive Brokers connection
 */
export const IB_CONFIG = {
  host: 'localhost',
  port: 7497, // IB Gateway port (7496 for paper trading)
  clientId: 1,
  reconnectInterval: 5000, // 5 seconds
  maxRetries: 3,
}

/**
 * Stock data from IB API response
 */
interface IBQuoteData {
  symbol: string
  price: number
  bid: number
  ask: number
  volume: number
  lastVolume: number
  lastPrice: number
  open: number
  high: number
  low: number
  close: number
  change: number
  changePercent: number
  timestamp: number
}

/**
 * Fetch real-time quote from Interactive Brokers
 * Requires IB Gateway/TWS running on localhost:7497
 * 
 * @param ticker - Stock ticker symbol
 * @returns Stock data or null if fetch fails
 */
export async function fetchStockFromIB(ticker: string): Promise<Stock | null> {
  try {
    // Call IB API endpoint (you would implement this via WebSocket or REST)
    // This is a placeholder for the actual IB API call
    const response = await fetch(`http://localhost:5000/api/ib/quote/${ticker}`)
    
    if (!response.ok) {
      console.error(`Failed to fetch ${ticker} from IB:`, response.statusText)
      return null
    }

    const data: IBQuoteData = await response.json()

    // Calculate day gain percentage
    const dayGain = data.changePercent || 0
    const preMarketGain = 0 // Would need to calculate from pre-market data

    // Create Stock object from IB data
    const stock: Stock = {
      ticker: data.symbol,
      companyName: data.symbol, // Would need to fetch company name separately
      exchange: 'NASDAQ', // Would need to determine from IB data
      price: data.price,
      dayGain: dayGain,
      volume: data.volume,
      avgVolume: 0, // Would need historical data
      relativeVolume: 0, // Would calculate from avgVolume
      float: 0, // Would need to fetch from separate source
      sevenDayChange: 0, // Would need historical data
      lastHOD: data.high,
      preMarketGain: preMarketGain,
      timestamp: new Date(data.timestamp).toISOString(),
    }

    return stock
  } catch (error) {
    console.error(`Error fetching ${ticker} from IB:`, error)
    return null
  }
}

/**
 * Scan all stocks matching criteria from Interactive Brokers
 * Fetches top gainers and applies scan filters
 * 
 * @returns Array of stocks matching scan criteria
 */
export async function scanAllStocksFromIB(): Promise<Stock[]> {
  try {
    // Fetch top gainers from IB
    const response = await fetch('http://localhost:5000/api/ib/top-gainers')
    
    if (!response.ok) {
      console.error('Failed to fetch top gainers from IB:', response.statusText)
      return []
    }

    const gainers: IBQuoteData[] = await response.json()

    // Convert IB data to Stock objects
    const stocks: Stock[] = gainers
      .map((data) => ({
        ticker: data.symbol,
        companyName: data.symbol,
        exchange: 'NASDAQ',
        price: data.price,
        dayGain: data.changePercent || 0,
        volume: data.volume,
        avgVolume: 0,
        relativeVolume: 0,
        float: 0,
        sevenDayChange: 0,
        lastHOD: data.high,
        preMarketGain: 0,
        timestamp: new Date(data.timestamp).toISOString(),
      }))
      .filter((stock) => stock !== null) as Stock[]

    // Apply scan criteria filters
    const filtered = filterStocks(stocks, DEFAULT_CRITERIA)

    return filtered
  } catch (error) {
    console.error('Error scanning stocks from IB:', error)
    return []
  }
}

/**
 * Real-time stock monitoring
 * Continuously monitors stocks and updates when criteria are met
 */
export class IBStockMonitor {
  private watchlist: Set<string> = new Set()
  private updateInterval: NodeJS.Timeout | null = null
  private onUpdate: ((stocks: Stock[]) => void) | null = null

  /**
   * Start monitoring stocks
   */
  start(onUpdate: (stocks: Stock[]) => void, intervalMs: number = 300000) {
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
      const stocks = await scanAllStocksFromIB()
      
      if (this.onUpdate) {
        this.onUpdate(stocks)
      }

      // Log results
      console.log(`[IB Scanner] Found ${stocks.length} stocks matching criteria`)
      stocks.forEach((stock) => {
        console.log(`  ${stock.ticker}: +${stock.dayGain.toFixed(2)}% (${stock.volume} shares)`)
      })
    } catch (error) {
      console.error('[IB Scanner] Error during scan:', error)
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
 * Helper function to check IB Gateway connection
 */
export async function checkIBConnection(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:5000/api/ib/health')
    return response.ok
  } catch (error) {
    console.error('IB Gateway connection failed:', error)
    return false
  }
}

/**
 * Get connection status
 */
export async function getIBConnectionStatus(): Promise<{
  connected: boolean
  message: string
  timestamp: string
}> {
  try {
    const response = await fetch('http://localhost:5000/api/ib/status')
    
    if (!response.ok) {
      return {
        connected: false,
        message: 'IB Gateway not responding',
        timestamp: new Date().toISOString(),
      }
    }

    const data = await response.json()
    return {
      connected: true,
      message: 'Connected to IB Gateway',
      timestamp: new Date().toISOString(),
      ...data,
    }
  } catch (error) {
    return {
      connected: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
    }
  }
}

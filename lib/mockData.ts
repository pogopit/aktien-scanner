/**
 * Mock data for the Day Trading Scanner
 * In production, this would be replaced with real API calls
 */

import type { Stock, ScanResult, ScanCriteria } from './types'

// Define scan criteria
export const DEFAULT_CRITERIA: ScanCriteria = {
  minPrice: 1.0,
  maxPrice: 20.0,
  minDayGain: 10, // 10%
  maxSevenDayChange: 10, // ±10%
  minRelativeVolume: 5, // 5x
  minDayVolume: 100000, // 100,000 shares
}

/**
 * Mock stock data that matches the scan criteria
 * All stocks meet the filtering requirements
 */
export const MOCK_STOCKS: Stock[] = [
  {
    ticker: 'VERO',
    price: 6.72,
    dayGain: 369.93,
    volume: 308900000,
    avgVolume: 45000000,
    relativeVolume: 6.86,
    float: 1.9,
    sevenDayChange: 8.5,
    lastHOD: 7.2,
    preMarketGain: 15.2,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'IVF',
    price: 1.64,
    dayGain: 102.09,
    volume: 61500000,
    avgVolume: 10000000,
    relativeVolume: 6.15,
    float: 15.1,
    sevenDayChange: -8.2,
    lastHOD: 1.85,
    preMarketGain: 8.5,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'JFBR',
    price: 1.12,
    dayGain: 100.72,
    volume: 235100000,
    avgVolume: 35000000,
    relativeVolume: 6.72,
    float: 3.2,
    sevenDayChange: 5.3,
    lastHOD: 1.25,
    preMarketGain: 12.1,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'JAGX',
    price: 1.23,
    dayGain: 60.89,
    volume: 160400000,
    avgVolume: 25000000,
    relativeVolume: 6.42,
    float: 4.2,
    sevenDayChange: 7.8,
    lastHOD: 1.35,
    preMarketGain: 10.3,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'TNMG',
    price: 3.68,
    dayGain: 55.93,
    volume: 27800000,
    avgVolume: 4500000,
    relativeVolume: 6.18,
    float: 41.3,
    sevenDayChange: -6.5,
    lastHOD: 4.1,
    preMarketGain: 9.2,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'NIVF',
    price: 0.73,
    dayGain: 42.64,
    volume: 18600000,
    avgVolume: 3000000,
    relativeVolume: 6.2,
    float: 1.3,
    sevenDayChange: 4.1,
    lastHOD: 0.82,
    preMarketGain: 7.8,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'BIYA',
    price: 6.41,
    dayGain: 42.13,
    volume: 20300000,
    avgVolume: 3200000,
    relativeVolume: 6.34,
    float: 1.2,
    sevenDayChange: 3.2,
    lastHOD: 7.15,
    preMarketGain: 8.9,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'LCFY',
    price: 4.43,
    dayGain: 41.53,
    volume: 42700000,
    avgVolume: 6800000,
    relativeVolume: 6.28,
    float: 1.8,
    sevenDayChange: 6.7,
    lastHOD: 4.95,
    preMarketGain: 11.2,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'IBRX',
    price: 5.53,
    dayGain: 39.87,
    volume: 182300000,
    avgVolume: 28000000,
    relativeVolume: 6.51,
    float: 985,
    sevenDayChange: -7.3,
    lastHOD: 6.2,
    preMarketGain: 9.5,
    timestamp: new Date().toISOString(),
  },
  {
    ticker: 'PRFX',
    price: 1.15,
    dayGain: 39.79,
    volume: 64200000,
    avgVolume: 10000000,
    relativeVolume: 6.42,
    float: 3.9,
    sevenDayChange: 5.8,
    lastHOD: 1.28,
    preMarketGain: 10.1,
    timestamp: new Date().toISOString(),
  },
]

/**
 * Filter stocks based on scan criteria
 * @param stocks - Array of stocks to filter
 * @param criteria - Scan criteria to apply
 * @returns Filtered array of stocks that meet all criteria
 */
export function filterStocks(stocks: Stock[], criteria: ScanCriteria): Stock[] {
  return stocks.filter((stock) => {
    // Price filter: $1.00 - $20.00
    if (stock.price < criteria.minPrice || stock.price > criteria.maxPrice) {
      return false
    }

    // Day gain filter: minimum 10% (including pre-market)
    const totalDayGain = stock.dayGain + (stock.preMarketGain || 0)
    if (totalDayGain < criteria.minDayGain) {
      return false
    }

    // 7-day consolidation filter: max ±10% change
    if (Math.abs(stock.sevenDayChange) > criteria.maxSevenDayChange) {
      return false
    }

    // Relative volume filter: minimum 5x
    if (stock.relativeVolume < criteria.minRelativeVolume) {
      return false
    }

    // Day volume filter: minimum 100,000 shares
    if (stock.volume < criteria.minDayVolume) {
      return false
    }

    return true
  })
}

/**
 * Get scan results with filtered stocks
 * @returns ScanResult with filtered stocks and metadata
 */
export function getScanResults(): ScanResult {
  const filteredStocks = filterStocks(MOCK_STOCKS, DEFAULT_CRITERIA)

  return {
    stocks: filteredStocks.sort((a, b) => b.dayGain - a.dayGain),
    totalMatching: filteredStocks.length,
    timestamp: new Date().toISOString(),
    criteria: DEFAULT_CRITERIA,
  }
}

/**
 * Calculate gauge percentage (percentage of stocks meeting criteria)
 * @returns Percentage of stocks that meet all criteria
 */
export function calculateGaugePercentage(): number {
  const filtered = filterStocks(MOCK_STOCKS, DEFAULT_CRITERIA)
  return Math.round((filtered.length / MOCK_STOCKS.length) * 100)
}

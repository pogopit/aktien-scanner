/**
 * Type definitions for the Day Trading Scanner
 */

export interface Stock {
  ticker: string
  price: number
  dayGain: number // Percentage gain today (including pre-market)
  volume: number // Total volume in shares
  avgVolume: number // Average volume
  relativeVolume: number // Volume ratio (current / average)
  float: number // Float in millions
  sevenDayChange: number // 7-day price change percentage
  lastHOD: number | null // Last high of day
  preMarketGain?: number // Pre-market gain percentage
  timestamp: string
}

export interface ScanCriteria {
  minPrice: number // $1.00
  maxPrice: number // $20.00
  minDayGain: number // 10%
  maxSevenDayChange: number // ±10%
  minRelativeVolume: number // 5x
  minDayVolume: number // 100,000 shares
}

export interface ScanResult {
  stocks: Stock[]
  totalMatching: number
  timestamp: string
  criteria: ScanCriteria
}

export interface GaugeData {
  percentage: number
  label: string
  timestamp: string
}

/**
 * Advanced Filter Logic for Day Trading Scanner
 * Implements Kill-Filters and Scoring Model
 */

import type { Stock } from './types'

/**
 * Kill-Filter: Stocks that are unsuitable for momentum day trading
 * Returns true if stock should be FILTERED OUT (killed)
 */
export function applyKillFilters(stock: Stock): boolean {
  // Kill Filter 1: Float too large (> 500M) - too sluggish
  if (stock.float > 500) {
    return true // KILL this stock
  }

  // Kill Filter 2: Float 15M+ AND low volume (< 100M) - weak momentum
  if (stock.float >= 15 && stock.volume < 100000000) {
    return true // KILL this stock
  }

  // Kill Filter 3: Gain < 50% AND Float > 10M - not explosive enough
  const totalGain = stock.dayGain + (stock.preMarketGain || 0)
  if (totalGain < 50 && stock.float > 10) {
    return true // KILL this stock
  }

  // Kill Filter 4: RelVol < 6x - insufficient volume spike
  if (stock.relativeVolume < 6) {
    return true // KILL this stock
  }

  return false // PASS - stock survives kill filters
}

/**
 * Scoring Model: Objective evaluation of momentum day trading candidates
 * Maximum 10 points
 */
export function calculateScore(stock: Stock): number {
  let score = 0
  const totalGain = stock.dayGain + (stock.preMarketGain || 0)

  // Criterion 1: Gain > 100% (+2 points)
  if (totalGain > 100) {
    score += 2
  }

  // Criterion 2: Float ≤ 5M (+2 points)
  if (stock.float <= 5) {
    score += 2
  }

  // Criterion 3: Volume > 150M (+2 points)
  if (stock.volume > 150000000) {
    score += 2
  }

  // Criterion 4: RelVol > 6.5x (+1 point)
  if (stock.relativeVolume > 6.5) {
    score += 1
  }

  // Criterion 5: Price 1-10$ (+1 point)
  if (stock.price >= 1 && stock.price <= 10) {
    score += 1
  }

  // Criterion 6: "Clean Momentum Day" - all criteria met (+2 points)
  // Clean day = high gain + high volume + small float + good relative volume
  if (
    totalGain > 100 &&
    stock.volume > 150000000 &&
    stock.float <= 5 &&
    stock.relativeVolume > 6.5
  ) {
    score += 2
  }

  return Math.min(score, 10) // Cap at 10 points
}

/**
 * Get rating emoji based on score
 */
export function getRatingEmoji(score: number): string {
  if (score >= 9) return '🚀🚀🚀' // A+ Daytrade
  if (score >= 8) return '🚀🚀' // Very strong
  if (score >= 7) return '🚀' // Good
  if (score >= 6) return '⚠️' // Only with setup
  return '❌' // Not suitable
}

/**
 * Get rating label based on score
 */
export function getRatingLabel(score: number): string {
  if (score >= 9) return 'A+ Daytrade'
  if (score >= 8) return 'Very Strong'
  if (score >= 7) return 'Good'
  if (score >= 6) return 'Only with Setup'
  return 'Not Suitable'
}

/**
 * Get kill filter reason if stock is filtered out
 */
export function getKillFilterReason(stock: Stock): string | null {
  const totalGain = stock.dayGain + (stock.preMarketGain || 0)

  if (stock.float > 500) {
    return `Float ~${stock.float}M → too sluggish`
  }

  if (stock.float >= 15 && stock.volume < 100000000) {
    return `Float ${stock.float}M + low volume`
  }

  if (totalGain < 50 && stock.float > 10) {
    return `No extreme momentum`
  }

  if (stock.relativeVolume < 6) {
    return `RelVol ${stock.relativeVolume.toFixed(2)}x < 6x`
  }

  return null
}

/**
 * Filter and score stocks
 */
export function filterAndScoreStocks(stocks: Stock[]) {
  const killed: Array<Stock & { reason: string }> = []
  const survivors: Array<Stock & { score: number; rating: string; emoji: string }> = []

  stocks.forEach((stock) => {
    const killReason = getKillFilterReason(stock)

    if (killReason) {
      killed.push({
        ...stock,
        reason: killReason,
      })
    } else {
      const score = calculateScore(stock)
      survivors.push({
        ...stock,
        score,
        rating: getRatingLabel(score),
        emoji: getRatingEmoji(score),
      })
    }
  })

  // Sort survivors by score (highest first)
  survivors.sort((a, b) => b.score - a.score)

  return {
    killed,
    survivors,
    totalKilled: killed.length,
    totalSurvivors: survivors.length,
  }
}

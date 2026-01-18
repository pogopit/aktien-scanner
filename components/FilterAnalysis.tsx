/**
 * FilterAnalysis Component
 * Shows Kill-Filters and Scoring Analysis
 */

'use client'

import React, { useState } from 'react'
import type { Stock } from '@/lib/types'
import { filterAndScoreStocks } from '@/lib/filterLogic'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FilterAnalysisProps {
  stocks: Stock[]
}

export function FilterAnalysis({ stocks }: FilterAnalysisProps) {
  const [expandedKilled, setExpandedKilled] = useState(false)
  const [expandedSurvivors, setExpandedSurvivors] = useState(true)

  const { killed, survivors, totalKilled, totalSurvivors } = filterAndScoreStocks(stocks)

  return (
    <div className="w-full space-y-6">
      {/* Kill-Filters Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedKilled(!expandedKilled)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Kill-Filter (Schnelle Vorauswahl)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {totalKilled} stocks filtered out - unsuitable for momentum day trading
              </p>
            </div>
          </div>
          {expandedKilled ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedKilled && (
          <div className="border-t border-gray-800 px-6 py-4 space-y-3">
            {killed.length === 0 ? (
              <p className="text-sm text-gray-400">No stocks filtered out</p>
            ) : (
              killed.map((stock) => (
                <div
                  key={stock.ticker}
                  className="flex items-start justify-between p-3 bg-gray-800/30 rounded border border-gray-700"
                >
                  <div>
                    <p className="font-semibold text-white">{stock.ticker}</p>
                    <p className="text-xs text-gray-400 mt-1">{stock.reason}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    Float: {stock.float}M
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Scoring Analysis Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSurvivors(!expandedSurvivors)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Scoring-Modell (Kernvergleich)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {totalSurvivors} serious candidates - ranked by momentum score
              </p>
            </div>
          </div>
          {expandedSurvivors ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSurvivors && (
          <div className="border-t border-gray-800 px-6 py-4">
            {/* Scoring Criteria Legend */}
            <div className="mb-6 p-4 bg-gray-800/30 rounded border border-gray-700">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
                📊 Bewertungsmatrix (max. 10 Punkte)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                <div>✅ Gain &gt; 100% → +2</div>
                <div>✅ Float ≤ 5M → +2</div>
                <div>✅ Volume &gt; 150M → +2</div>
                <div>✅ RelVol &gt; 6.5x → +1</div>
                <div>✅ Price 1–10$ → +1</div>
                <div>✅ Clean Momentum Day → +2</div>
              </div>
            </div>

            {/* Survivors List */}
            <div className="space-y-3">
              {survivors.map((stock, index) => (
                <div
                  key={stock.ticker}
                  className="p-4 bg-gray-800/30 rounded border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stock.emoji}</span>
                      <div>
                        <p className="font-semibold text-white">{stock.ticker}</p>
                        <p className="text-xs text-gray-400">{stock.companyName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{stock.score}/10</p>
                      <p className="text-xs text-gray-400">{stock.rating}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mt-3 pt-3 border-t border-gray-700">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="text-white font-semibold">${stock.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gain</p>
                      <p className="text-green-400 font-semibold">
                        +{(stock.dayGain + (stock.preMarketGain || 0)).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vol</p>
                      <p className="text-white font-semibold">
                        {(stock.volume / 1000000).toFixed(0)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">RelVol</p>
                      <p className="text-white font-semibold">{stock.relativeVolume.toFixed(2)}x</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Float</p>
                      <p className="text-white font-semibold">{stock.float}M</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Total Stocks</p>
          <p className="text-2xl font-bold text-white mt-1">{stocks.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Filtered Out</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{totalKilled}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Serious Candidates</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{totalSurvivors}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Day Trading Scanner - Main Page
 * New layout:
 * - Header with live time
 * - Small Cap Gauge (full width)
 * - Top Gainers Table (full width)
 * - Active Scan Criteria (full width)
 */

'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { GaugeChart } from '@/components/GaugeChart'
import { StocksTable } from '@/components/StocksTable'
import { CriteriaDisplay } from '@/components/CriteriaDisplay'
import { getScanResults, calculateGaugePercentage } from '@/lib/mockData'

export default function Home() {
  // Get scan results with filtered stocks
  const scanResults = getScanResults()
  const gaugePercentage = calculateGaugePercentage()

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Container */}
      <div className="w-full px-4 py-8 md:py-12">
        {/* Header with live time */}
        <Header lastUpdate={scanResults.timestamp} />

        {/* Small Cap Gauge - Full Width */}
        <div className="w-full mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 text-center">
              Small Cap Gauge
            </h2>
            <div className="flex justify-center">
              <GaugeChart
                percentage={gaugePercentage}
                label="Criteria Met"
              />
            </div>
          </div>
        </div>

        {/* Stocks Table - Full Width */}
        <div className="w-full mb-8">
          <StocksTable
            stocks={scanResults.stocks}
            title={`TOP GAINERS TODAY (${scanResults.totalMatching} STOCKS)`}
          />
        </div>

        {/* Active Scan Criteria - Full Width */}
        <div className="w-full mb-8">
          <CriteriaDisplay criteria={scanResults.criteria} />
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-800 pt-6 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* Total Stocks */}
            <div>
              <p className="text-gray-500 uppercase text-xs tracking-wider">
                Total Stocks Scanned
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {scanResults.stocks.length}
              </p>
            </div>

            {/* Matching Criteria */}
            <div>
              <p className="text-gray-500 uppercase text-xs tracking-wider">
                Matching Criteria
              </p>
              <p className="text-2xl font-bold text-green-500 mt-1">
                {scanResults.totalMatching}
              </p>
            </div>

            {/* Success Rate */}
            <div>
              <p className="text-gray-500 uppercase text-xs tracking-wider">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {((scanResults.totalMatching / scanResults.stocks.length) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            About This Scanner
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            This day trading scanner filters stocks based on specific criteria designed to identify
            potential trading opportunities. All displayed stocks meet the following requirements:
            price between $1-$20, minimum 10% daily gain (including pre-market), maximum ±10% change
            over 7 days for consolidation, relative volume at least 5x the average, and minimum
            100,000 shares daily volume.
          </p>
        </div>
      </div>
    </main>
  )
}

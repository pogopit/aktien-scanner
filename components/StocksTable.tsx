/**
 * StocksTable Component
 * Displays filtered stocks in a sortable, responsive table
 * Shows: Ticker, Company Name, Exchange, Price, Day Gain %, Volume, Rel Vol, Float
 */

'use client'

import React, { useState } from 'react'
import type { Stock } from '@/lib/types'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface StocksTableProps {
  stocks: Stock[]
  title?: string
}

type SortField = 'ticker' | 'companyName' | 'exchange' | 'price' | 'dayGain' | 'volume' | 'float' | 'relativeVolume'
type SortDirection = 'asc' | 'desc'

export function StocksTable({ stocks, title = 'TOP GAINERS TODAY' }: StocksTableProps) {
  const [sortField, setSortField] = useState<SortField>('dayGain')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    let aValue: number | string = 0
    let bValue: number | string = 0

    switch (sortField) {
      case 'ticker':
        aValue = a.ticker
        bValue = b.ticker
        break
      case 'companyName':
        aValue = a.companyName
        bValue = b.companyName
        break
      case 'exchange':
        aValue = a.exchange
        bValue = b.exchange
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'dayGain':
        aValue = a.dayGain + (a.preMarketGain || 0)
        bValue = b.dayGain + (b.preMarketGain || 0)
        break
      case 'volume':
        aValue = a.volume
        bValue = b.volume
        break
      case 'float':
        aValue = a.float
        bValue = b.float
        break
      case 'relativeVolume':
        aValue = a.relativeVolume
        bValue = b.relativeVolume
        break
    }

    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue)
    }

    return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toFixed(0)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-500" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-green-500" />
    ) : (
      <ArrowDown className="w-3 h-3 text-green-500" />
    )
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {sortedStocks.length} stocks matching criteria
        </p>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto border border-gray-800 rounded-lg bg-gray-950">
        <table className="w-full text-xs">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="px-2 py-2 text-left font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('ticker')}
                  className="flex items-center gap-1 hover:text-green-500 transition-colors"
                >
                  TICKER
                  {getSortIcon('ticker')}
                </button>
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-300 min-w-[150px]">
                <button
                  onClick={() => handleSort('companyName')}
                  className="flex items-center gap-1 hover:text-green-500 transition-colors"
                >
                  COMPANY
                  {getSortIcon('companyName')}
                </button>
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('exchange')}
                  className="flex items-center gap-1 hover:text-green-500 transition-colors"
                >
                  EXCH
                  {getSortIcon('exchange')}
                </button>
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center justify-end gap-1 hover:text-green-500 transition-colors ml-auto"
                >
                  PRICE
                  {getSortIcon('price')}
                </button>
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('dayGain')}
                  className="flex items-center justify-end gap-1 hover:text-green-500 transition-colors ml-auto"
                >
                  GAIN %
                  {getSortIcon('dayGain')}
                </button>
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('volume')}
                  className="flex items-center justify-end gap-1 hover:text-green-500 transition-colors ml-auto"
                >
                  VOL
                  {getSortIcon('volume')}
                </button>
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('relativeVolume')}
                  className="flex items-center justify-end gap-1 hover:text-green-500 transition-colors ml-auto"
                >
                  REL VOL
                  {getSortIcon('relativeVolume')}
                </button>
              </th>
              <th className="px-2 py-2 text-right font-semibold text-gray-300">
                <button
                  onClick={() => handleSort('float')}
                  className="flex items-center justify-end gap-1 hover:text-green-500 transition-colors ml-auto"
                >
                  FLOAT
                  {getSortIcon('float')}
                </button>
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {sortedStocks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No stocks matching criteria
                </td>
              </tr>
            ) : (
              sortedStocks.map((stock) => {
                const totalGain = stock.dayGain + (stock.preMarketGain || 0)
                return (
                  <tr
                    key={stock.ticker}
                    className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                  >
                    {/* Ticker */}
                    <td className="px-2 py-2 font-bold text-white">
                      {stock.ticker}
                    </td>

                    {/* Company Name */}
                    <td className="px-2 py-2 text-gray-300 text-xs min-w-[150px]">
                      {stock.companyName}
                    </td>

                    {/* Exchange */}
                    <td className="px-2 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        stock.exchange === 'NASDAQ'
                          ? 'bg-blue-900/70 text-blue-200'
                          : 'bg-purple-900/70 text-purple-200'
                      }`}>
                        {stock.exchange}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-2 py-2 text-right text-gray-300">
                      ${stock.price.toFixed(2)}
                    </td>

                    {/* Gain % */}
                    <td className="px-2 py-2 text-right font-bold text-green-400">
                      +{totalGain.toFixed(2)}%
                    </td>

                    {/* Volume */}
                    <td className="px-2 py-2 text-right text-gray-300">
                      {formatNumber(stock.volume)}
                    </td>

                    {/* Relative Volume */}
                    <td className="px-2 py-2 text-right text-gray-300">
                      {stock.relativeVolume.toFixed(2)}x
                    </td>

                    {/* Float */}
                    <td className="px-2 py-2 text-right text-gray-300">
                      {formatNumber(stock.float)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * CriteriaDisplay Component
 * Shows all active scan criteria and their values
 */

'use client'

import React from 'react'
import type { ScanCriteria } from '@/lib/types'
import { Check } from 'lucide-react'

interface CriteriaDisplayProps {
  criteria: ScanCriteria
}

export function CriteriaDisplay({ criteria }: CriteriaDisplayProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Active Scan Criteria
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Price Range */}
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Price Range</p>
            <p className="text-sm font-semibold text-white">
              ${criteria.minPrice.toFixed(2)} - ${criteria.maxPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Day Gain */}
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Min Day Gain</p>
            <p className="text-sm font-semibold text-white">
              +{criteria.minDayGain.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* 7-Day Consolidation */}
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase">7-Day Consolidation</p>
            <p className="text-sm font-semibold text-white">
              ±{criteria.maxSevenDayChange.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Relative Volume */}
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Min Relative Volume</p>
            <p className="text-sm font-semibold text-white">
              {criteria.minRelativeVolume.toFixed(1)}x
            </p>
          </div>
        </div>

        {/* Day Volume */}
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Min Day Volume</p>
            <p className="text-sm font-semibold text-white">
              {(criteria.minDayVolume / 1000).toFixed(0)}K shares
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

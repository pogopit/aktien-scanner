/**
 * GaugeChart Component
 * Displays a circular gauge showing the percentage of stocks meeting scan criteria
 * Visual representation: Red (left) -> Yellow (middle) -> Green (right)
 */

'use client'

import React from 'react'

interface GaugeChartProps {
  percentage: number // 0-100
  label?: string
}

export function GaugeChart({ percentage, label = 'SCAN CRITERIA MET' }: GaugeChartProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  // Calculate rotation angle: -135 to 135 degrees (270 degree range)
  // -135 = 0%, 0 = 50%, 135 = 100%
  const angle = -135 + (clampedPercentage / 100) * 270

  // Determine color based on percentage
  let needleColor = '#ef4444' // Red for low
  if (clampedPercentage >= 33) needleColor = '#eab308' // Yellow for medium
  if (clampedPercentage >= 66) needleColor = '#22c55e' // Green for high

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-48 h-48">
        {/* SVG Gauge */}
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* Background arc segments */}
          {/* Red segment (0-33%) */}
          <path
            d="M 30 100 A 70 70 0 0 1 70 30"
            fill="none"
            stroke="#7f1d1d"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Yellow segment (33-66%) */}
          <path
            d="M 70 30 A 70 70 0 0 1 130 30"
            fill="none"
            stroke="#713f12"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Green segment (66-100%) */}
          <path
            d="M 130 30 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#15803d"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Center circle */}
          <circle cx="100" cy="100" r="8" fill="#ffffff" />

          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke={needleColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Labels */}
          <text
            x="30"
            y="115"
            fontSize="10"
            fill="#666"
            textAnchor="middle"
          >
            0%
          </text>
          <text
            x="100"
            y="115"
            fontSize="10"
            fill="#666"
            textAnchor="middle"
          >
            50%
          </text>
          <text
            x="170"
            y="115"
            fontSize="10"
            fill="#666"
            textAnchor="middle"
          >
            100%
          </text>
        </svg>

        {/* Percentage display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white">
            {clampedPercentage}%
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  )
}

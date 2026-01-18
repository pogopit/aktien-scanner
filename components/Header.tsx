/**
 * Header Component
 * Displays title, live time, and last update timestamp
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

interface HeaderProps {
  lastUpdate?: string
}

export function Header({ lastUpdate }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  /**
   * Update current time every second
   * Only run on client side to avoid hydration mismatch
   */
  useEffect(() => {
    setIsClient(true)
    
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-b border-gray-800 pb-6 mb-6">
      {/* Title and Live Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">
            LIVE MARKET DATA
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Day Trading Scanner
      </h1>

      {/* Time and Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {isClient ? (
            <div className="text-4xl md:text-5xl font-mono font-bold text-green-500">
              {currentTime || '00:00:00'}
            </div>
          ) : (
            <div className="text-4xl md:text-5xl font-mono font-bold text-green-500">
              --:--:--
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Last Update
            </p>
            <p className="text-sm text-gray-400 font-mono">
              {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

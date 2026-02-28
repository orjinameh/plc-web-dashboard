'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import Link from 'next/link'

type PlcRecord = {
  _id: string
  temperature: number
  pressure: number
  beltSpeed: number
  itemCount: number
  alarms: string[]
  timestamp: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<PlcRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/history')
        const data = await res.json()
        // Reverse so oldest is first on chart
        setHistory(data.reverse())
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
    // Refresh every 10 seconds
    const interval = setInterval(fetchHistory, 10000)
    return () => clearInterval(interval)
  }, [])

  const chartData = history.map((record) => ({
    time: new Date(record.timestamp).toLocaleTimeString(),
    temperature: record.temperature,
    pressure: record.pressure,
    beltSpeed: record.beltSpeed
  }))

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading history...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📊 Historical Data
          </h1>
          <p className="text-sm text-gray-500">
            Last {history.length} records from MongoDB
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          ← Live Dashboard
        </Link>
      </div>

      {/* Combined Chart */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          All Sensors History
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Temperature (°C)"
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Pressure (bar)"
            />
            <Line
              type="monotone"
              dataKey="beltSpeed"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Belt Speed (rpm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* History Table */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          Raw Data Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-600">Time</th>
                <th className="px-4 py-2 text-left text-gray-600">Temp (°C)</th>
                <th className="px-4 py-2 text-left text-gray-600">Pressure (bar)</th>
                <th className="px-4 py-2 text-left text-gray-600">Belt (rpm)</th>
                <th className="px-4 py-2 text-left text-gray-600">Items</th>
                <th className="px-4 py-2 text-left text-gray-600">Alarms</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((record) => (
                <tr
                  key={record._id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    record.alarms.length > 0 ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </td>
                  <td className={`px-4 py-2 font-medium ${
                    record.temperature > 80 ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {record.temperature}
                  </td>
                  <td className={`px-4 py-2 font-medium ${
                    record.pressure < 0.5 ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {record.pressure}
                  </td>
                  <td className={`px-4 py-2 font-medium ${
                    record.beltSpeed === 0 ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {record.beltSpeed}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {record.itemCount}
                  </td>
                  <td className="px-4 py-2">
                    {record.alarms.length > 0 ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        {record.alarms.join(', ')}
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        None
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
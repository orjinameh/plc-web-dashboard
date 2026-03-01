'use client'

import { useEffect, useState } from 'react'
import { connectWebSocket, disconnectWebSocket, type PlcData } from '@/lib/websocket'
import StatusCard from '@/components/StatusCard'
import RealtimeChart from '@/components/RealtimeChart'
import AlarmTable from '@/components/AlarmTable'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isAuthenticated, logout } from '@/lib/auth'

type DataPoint = {
  time: string
  value: number
}

type AlarmEntry = {
  message: string
  timestamp: string
}

const MAX_DATA_POINTS = 60 // keep last 60 seconds

export default function Dashboard() {
  const [connected, setConnected] = useState(false)
  const [plcData, setPlcData] = useState<PlcData | null>(null)
  const [tempHistory, setTempHistory] = useState<DataPoint[]>([])
  const [pressureHistory, setPressureHistory] = useState<DataPoint[]>([])
  const [beltHistory, setBeltHistory] = useState<DataPoint[]>([])
  const [alarmLog, setAlarmLog] = useState<AlarmEntry[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    connectWebSocket(
      (data) => {
        setPlcData(data)

        const time = new Date(data.timestamp).toLocaleTimeString()

        // Update chart histories
        setTempHistory((prev) => [
          ...prev.slice(-MAX_DATA_POINTS),
          { time, value: data.temperature }
        ])
        setPressureHistory((prev) => [
          ...prev.slice(-MAX_DATA_POINTS),
          { time, value: data.pressure }
        ])
        setBeltHistory((prev) => [
          ...prev.slice(-MAX_DATA_POINTS),
          { time, value: data.beltSpeed }
        ])

        // Update alarms
        if (data.alarms.length > 0) {
          setAlarmLog(
            data.alarms.map((alarm) => ({
              message: alarm,
              timestamp: data.timestamp
            }))
          )
        } else {
          setAlarmLog([])
        }
      },
      () => setConnected(true),
      () => setConnected(false)
    )

    return () => disconnectWebSocket()
  }, [])

  const getStatus = (value: number, warnThreshold: number, dangerThreshold: number) => {
    if (value >= dangerThreshold) return 'danger'
    if (value >= warnThreshold) return 'warning'
    return 'normal'
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🏭 PLC Monitoring Dashboard
          </h1>
          <p className="text-sm text-gray-500">Real-time industrial process monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/history"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            📊 View History
          </Link>
          <button
            onClick={logout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-red-600'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatusCard
          title="Temperature"
          value={plcData?.temperature.toFixed(1) ?? '--'}
          unit="°C"
          icon="🌡️"
          status={plcData ? getStatus(plcData.temperature, 60, 80) : 'normal'}
        />
        <StatusCard
          title="Pressure"
          value={plcData?.pressure.toFixed(2) ?? '--'}
          unit="bar"
          icon="💨"
          status={plcData ? getStatus(plcData.pressure, 1.5, 2.0) : 'normal'}
        />
        <StatusCard
          title="Belt Speed"
          value={plcData?.beltSpeed ?? '--'}
          unit="rpm"
          icon="⚙️"
          status={plcData ? (plcData.beltSpeed === 0 ? 'danger' : 'normal') : 'normal'}
        />
        <StatusCard
          title="Item Count"
          value={plcData?.itemCount ?? '--'}
          unit="pcs"
          icon="📦"
          status="normal"
        />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <RealtimeChart
          data={tempHistory}
          title="Temperature"
          color="#ef4444"
          unit="°C"
        />
        <RealtimeChart
          data={pressureHistory}
          title="Pressure"
          color="#3b82f6"
          unit="bar"
        />
        <RealtimeChart
          data={beltHistory}
          title="Belt Speed"
          color="#10b981"
          unit="rpm"
        />
      </div>

      {/* Alarm Table */}
      <AlarmTable alarms={alarmLog} />
    </main>
  )
}
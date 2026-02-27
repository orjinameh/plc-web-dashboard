type Alarm = {
  message: string
  timestamp: string
}

type AlarmTableProps = {
  alarms: Alarm[]
}

export default function AlarmTable({ alarms }: AlarmTableProps) {
  if (alarms.length === 0) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          🚨 Active Alarms
        </h3>
        <div className="flex items-center justify-center py-8 text-green-500">
          <p className="text-lg font-medium">✅ No active alarms</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        🚨 Active Alarms ({alarms.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-red-50">
              <th className="px-4 py-2 text-left text-red-700">Alarm</th>
              <th className="px-4 py-2 text-left text-red-700">Time</th>
              <th className="px-4 py-2 text-left text-red-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm, index) => (
              <tr
                key={index}
                className="border-b hover:bg-red-50 transition-colors"
              >
                <td className="px-4 py-2 font-medium text-red-600">
                  ⚠️ {alarm.message.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(alarm.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 animate-pulse">
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

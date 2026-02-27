type StatusCardProps = {
  title: string
  value: string | number
  unit: string
  status: 'normal' | 'warning' | 'danger'
  icon: string
}

export default function StatusCard({
  title,
  value,
  unit,
  status,
  icon
}: StatusCardProps) {
  const statusColors = {
    normal: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    danger: 'bg-red-100 border-red-500 text-red-700'
  }

  const valueColors = {
    normal: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  }

  return (
    <div className={`rounded-lg border-l-4 p-4 shadow-md ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className={`text-3xl font-bold ${valueColors[status]}`}>
            {value}
            <span className="text-sm font-normal ml-1">{unit}</span>
          </p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full animate-pulse ${
          status === 'normal' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`} />
        <span className="text-xs capitalize">{status}</span>
      </div>
    </div>
  )
}

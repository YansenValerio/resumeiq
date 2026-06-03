type Priority = 'high' | 'medium' | 'low'

const STYLES: Record<Priority, string> = {
  high:   'bg-rose-50 text-rose-700 ring-rose-200/60',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  low:    'bg-slate-100 text-slate-600 ring-slate-200',
}

const DOT: Record<Priority, string> = {
  high:   'bg-rose-500',
  medium: 'bg-amber-500',
  low:    'bg-slate-400',
}

const LABEL: Record<Priority, string> = {
  high: 'High', medium: 'Medium', low: 'Low',
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase ring-1 ${STYLES[priority]}`}>
      <span className={`h-1 w-1 rounded-full ${DOT[priority]}`} />
      {LABEL[priority]}
    </span>
  )
}

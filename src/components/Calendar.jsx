import React from 'react'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export default function Calendar({ year, month, onSelectDate, activeDate }) {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  // 周一为起始
  let startWeekday = firstDay.getDay() - 1
  if (startWeekday < 0) startWeekday = 6

  const daysInMonth = lastDay.getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  const isActive = (d) => {
    if (!activeDate) return false
    return activeDate.year === year && activeDate.month === month && activeDate.day === d
  }

  const isToday = (d) => {
    const t = new Date()
    return t.getFullYear() === year && t.getMonth() + 1 === month && t.getDate() === d
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-xs text-gray-400 font-medium py-2">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-3">
        {cells.map((d, i) => (
          <div key={i} className="flex justify-center">
            {d ? (
              <button
                onClick={() => onSelectDate({ year, month, day: d })}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-150 active:scale-90
                  ${isActive(d) ? 'bg-black text-white' : ''}
                  ${isToday(d) && !isActive(d) ? 'bg-cyan text-black' : ''}
                  ${!isActive(d) && !isToday(d) ? 'text-black hover:bg-gray-100' : ''}
                `}
              >
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

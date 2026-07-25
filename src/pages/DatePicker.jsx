import React, { useState } from 'react'

export default function DatePicker({ year, month, onConfirm, onCancel }) {
  const [y, setY] = useState(year)
  const [m, setM] = useState(month)

  const years = []
  for (let i = 2024; i <= 2030; i++) years.push(i)

  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold mb-4 text-center">选择年月</h3>

      <div className="flex gap-3 h-48">
        {/* 年份 */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 rounded-2xl p-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setY(year)}
              className={`
                w-full py-2 rounded-xl text-sm font-medium transition-all
                ${y === year ? 'bg-cyan text-black font-bold' : 'text-gray-600 hover:bg-gray-200'}
              `}
            >
              {year}年
            </button>
          ))}
        </div>

        {/* 月份 */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 rounded-2xl p-2">
          {months.map(mo => (
            <button
              key={mo}
              onClick={() => setM(mo)}
              className={`
                w-full py-2 rounded-xl text-sm font-medium transition-all
                ${m === mo ? 'bg-cyan text-black font-bold' : 'text-gray-600 hover:bg-gray-200'}
              `}
            >
              {mo}月
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
        >
          取消
        </button>
        <button
          onClick={() => onConfirm(y, m)}
          className="flex-1 py-2.5 rounded-full bg-cyan text-black text-sm font-bold"
        >
          确认
        </button>
      </div>
    </div>
  )
}

import React, { useState } from 'react'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export default function Calendar({ year, month, inspirations, onSelectDate, activeDate }) {
  const [expandedDate, setExpandedDate] = useState(null)
  const [emptyHintDate, setEmptyHintDate] = useState(null)
  const [selectedInspiration, setSelectedInspiration] = useState(null)

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

  // 获取某天的灵感
  const getInspirationsForDate = (d) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return inspirations.filter(i => i.date === dateStr)
  }

  const handleDateClick = (d) => {
    const dateObj = { year, month, day: d }
    onSelectDate(dateObj)
    setSelectedInspiration(null) // 关闭详情卡片

    const dayInspirations = getInspirationsForDate(d)
    if (dayInspirations.length > 0) {
      // 有灵感：展开/收起
      if (expandedDate === d) {
        setExpandedDate(null)
      } else {
        setExpandedDate(d)
      }
    } else {
      // 无灵感：显示小提示，2秒后消失
      setEmptyHintDate(d)
      setTimeout(() => setEmptyHintDate(null), 2000)
      // 同时展开显示提示
      setExpandedDate(d)
    }
  }

  const handleInspirationClick = (insp) => {
    setSelectedInspiration(insp)
  }

  return (
    <div className="w-full">
      {/* 星期标题 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-xs text-gray-400 font-medium py-2">
            {w}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          const dayInspirations = d ? getInspirationsForDate(d) : []
          const hasData = dayInspirations.length > 0
          const isExpanded = expandedDate === d

          return (
            <div key={i} className="flex flex-col items-center">
              {d ? (
                <>
                  {/* 日期按钮 */}
                  <button
                    onClick={() => handleDateClick(d)}
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                      transition-all duration-150 active:scale-90 relative
                      ${isActive(d) ? 'bg-black text-white' : ''}
                      ${isToday(d) && !isActive(d) ? 'bg-cyan text-black' : ''}
                      ${!isActive(d) && !isToday(d) ? 'text-black hover:bg-gray-100' : ''}
                    `}
                  >
                    {d}
                  </button>

                  {/* 有灵感：展开泡泡框 */}
                  {isExpanded && hasData && (
                    <div className="mt-1 w-full max-w-[120px] animate-fade-in z-10">
                      {dayInspirations.map((insp) => (
                        <div
                          key={insp.id}
                          onClick={() => handleInspirationClick(insp)}
                          className={`rounded-xl px-2 py-1 mb-1 text-[10px] leading-tight truncate cursor-pointer transition-all ${
                            selectedInspiration?.id === insp.id
                              ? 'bg-cyan/40 ring-1 ring-cyan'
                              : 'bg-cyan/20 hover:bg-cyan/30'
                          } text-black`}
                        >
                          {insp.title}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 无灵感：显示提示 */}
                  {isExpanded && !hasData && emptyHintDate === d && (
                    <div className="mt-1 animate-fade-in z-10">
                      <div className="bg-gray-100 rounded-xl px-2 py-1.5 text-[10px] text-gray-400 text-center">
                        点击＋记录灵感
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* 空白日期 - 虚线框 */
                <div className="w-9 h-9 rounded-full border border-dashed border-gray-300"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* 灵感详情小卡片 */}
      {selectedInspiration && (
        <div className="mt-4 bg-white rounded-card p-4 shadow-md animate-fade-in border border-cyan/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base text-black mb-1">{selectedInspiration.title}</h4>
              {selectedInspiration.detail && (
                <p className="text-sm text-gray-500 leading-relaxed mb-2">{selectedInspiration.detail}</p>
              )}
              {/* 照片预览 */}
              {selectedInspiration.photos && selectedInspiration.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {selectedInspiration.photos.map(p => (
                    <div key={p.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {p.type === 'image' || p.type === 'camera' ? (
                        <img src={p.data} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {p.type === 'video' ? '🎬' : '🎵'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-2">{selectedInspiration.date}</p>
            </div>
            <button
              onClick={() => setSelectedInspiration(null)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

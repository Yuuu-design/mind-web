import React, { useState } from 'react'
import Calendar from '../components/Calendar'
import BottomNav from '../components/BottomNav'
import Modal from '../components/Modal'
import DatePicker from './DatePicker'

export default function Home({
  inspirations,
  todos,
  onSelectDate,
  activeDate,
  onChangeNav,
}) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [showPicker, setShowPicker] = useState(false)
  const [selectedInspiration, setSelectedInspiration] = useState(null)

  const handleSelectDate = (d) => {
    onSelectDate(d)
  }

  // 上一月
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
  }

  // 下一月
  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部：相机 + 设置 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            alert('相机功能在完整版中启用')
          }}
          className="w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>

        <button
          onClick={() => onChangeNav('settings')}
          className="w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="19" cy="12" r="2"/>
          </svg>
        </button>
      </div>

      {/* 月份导航 - 卡片外上方 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:bg-gray-100 active:scale-90 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          onClick={() => setShowPicker(true)}
          className="text-lg font-bold text-black px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {year}年{month}月
        </button>
        <button
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:bg-gray-100 active:scale-90 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* 日历卡片 */}
      <div className="bg-white rounded-card p-5 shadow-sm mb-4">
        <Calendar
          year={year}
          month={month}
          inspirations={inspirations}
          onSelectDate={handleSelectDate}
          activeDate={activeDate}
        />
      </div>

      {/* 年月选择弹窗 */}
      <Modal open={showPicker} onClose={() => setShowPicker(false)}>
        <DatePicker
          year={year}
          month={month}
          onConfirm={(y, m) => {
            setYear(y)
            setMonth(m)
            setShowPicker(false)
          }}
          onCancel={() => setShowPicker(false)}
        />
      </Modal>

      {/* 最近留下的灵感 */}
      {inspirations.length > 0 && (
        <div className="mb-20">
          <h3 className="text-sm font-bold text-black mb-3">最近留下</h3>
          <div className="space-y-4">
            {inspirations.slice(0, 3).map((item, idx) => {
              const relativeTime = item.time ? (() => {
                const [year, month, day, hour, minute] = item.time.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/)?.slice(1) || []
                if (!hour) return item.date || '今天'
                const now = new Date()
                const itemDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
                const diffMs = now.getTime() - itemDate.getTime()
                const diffMins = Math.floor(diffMs / 60000)
                const diffHours = Math.floor(diffMins / 60)
                const diffDays = Math.floor(diffHours / 24)
                if (diffMins < 1) return '刚刚'
                if (diffMins < 60) return `${diffMins}分钟前`
                if (diffHours < 24) return `${diffHours}小时前`
                if (diffDays < 7) return `${diffDays}天前`
                return item.date || '今天'
              })() : item.date || '今天'
              const titles = ['灵光一现', '灵感碎片', '思维火花', '创意瞬间', '脑海闪光']
              const icons = [
                <svg key="1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.7V18h6v-1.6c0-.7.4-1.3 1-1.7A7 7 0 0 0 12 2z"/></svg>,
                <svg key="2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
                <svg key="3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                <svg key="4" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                <svg key="5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8"/></svg>,
              ]
              const hasPhotos = item.photos && item.photos.length > 0
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedInspiration(item)
                    onChangeNav('inspiration')
                  }}
                  className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-3 cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md"
                >
                  <span className="text-pink mt-0.5">{icons[idx % icons.length]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-pink font-semibold">
                        {relativeTime} · {titles[idx % titles.length]}
                      </p>
                      {hasPhotos && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                          </svg>
                          {item.photos.length}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{item.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 底部导航：灵感 ＋ 待办 */}
      <BottomNav active="plus" onChange={onChangeNav} />

      {/* 灵感详情弹窗 */}
      <Modal open={!!selectedInspiration} onClose={() => setSelectedInspiration(null)}>
        {selectedInspiration && (
          <div>
            <p className="text-xs text-cyan font-medium mb-2">
              {selectedInspiration.date && `${selectedInspiration.date.split('-')[1]}月${selectedInspiration.date.split('-')[2]}号`}
            </p>
            <h3 className="text-lg font-bold text-black mb-3">{selectedInspiration.title}</h3>
            {selectedInspiration.detail && (
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{selectedInspiration.detail}</p>
            )}
            {selectedInspiration.photos && selectedInspiration.photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {selectedInspiration.photos.map(p => (
                  <div key={p.id} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
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
            <button
              onClick={() => setSelectedInspiration(null)}
              className="w-full bg-black text-white rounded-full py-2 text-sm font-medium"
            >
              关闭
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

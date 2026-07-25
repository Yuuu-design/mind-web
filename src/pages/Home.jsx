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

      {/* 底部导航：灵感 ＋ 待办 */}
      <BottomNav active="plus" onChange={onChangeNav} />
    </div>
  )
}

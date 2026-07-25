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
  const [showDetail, setShowDetail] = useState(false)

  const handleSelectDate = (d) => {
    onSelectDate(d)
    const hasContent = hasDataForDate(d)
    if (hasContent) {
      setShowDetail(true)
    }
  }

  const hasDataForDate = (d) => {
    const dateStr = `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`
    const hasInsp = inspirations.some(i => i.date === dateStr)
    const hasTodo = todos.some(t => t.date === dateStr)
    return hasInsp || hasTodo
  }

  const getDateData = (d) => {
    const dateStr = `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`
    const insps = inspirations.filter(i => i.date === dateStr)
    const td = todos.filter(t => t.date === dateStr)
    return { insps, td }
  }

  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-24 animate-fade-in">
      {/* 顶部：设置 + 年月 + 相机 */}
      <div className="flex items-center justify-between mb-6">
        {/* 左上角：设置入口（无圆圈背景） */}
        <button
          onClick={() => onChangeNav('settings')}
          className="w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {/* 中间：年月 */}
        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2"
        >
          <h1 className="text-2xl font-bold text-black">
            {year}年{monthNames[month-1]}
          </h1>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {/* 右上角：相机icon（预留） */}
        <button
          onClick={() => {
            // 预留：后续接入照片/视频存储功能
            alert('相机功能在完整版中启用')
          }}
          className="w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
      </div>

      {/* 日历 */}
      <Calendar
        year={year}
        month={month}
        onSelectDate={handleSelectDate}
        activeDate={activeDate}
      />

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

      {/* 当天详情弹窗 */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)}>
        {activeDate && (
          <DayDetail
            date={activeDate}
            data={getDateData(activeDate)}
            onClose={() => setShowDetail(false)}
          />
        )}
      </Modal>

      {/* 底部导航：灵感 ＋ 待办 */}
      <BottomNav active="plus" onChange={onChangeNav} />
    </div>
  )
}

function DayDetail({ date, data, onClose }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">
        {date.month}月{date.day}日
      </h3>

      {data.insps.length === 0 && data.td.length === 0 ? (
        <p className="text-sm text-gray-400">这天还没有记录</p>
      ) : (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
          {data.insps.length > 0 && (
            <div>
              <span className="text-[10px] text-cyan font-bold">灵感</span>
              {data.insps.map(i => (
                <div key={i.id} className="mt-1 text-sm bg-cyan/10 rounded-xl p-3">
                  <div className="font-medium">{i.title}</div>
                  {i.detail && <div className="text-gray-500 text-xs mt-1">{i.detail}</div>}
                </div>
              ))}
            </div>
          )}
          {data.td.length > 0 && (
            <div>
              <span className="text-[10px] text-pink font-bold">待办</span>
              {data.td.map(t => (
                <div key={t.id} className="mt-1 text-sm bg-pink/10 rounded-xl p-3">
                  {t.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-4 w-full bg-cyan text-black rounded-full py-2 text-sm font-bold"
      >
        关闭
      </button>
    </div>
  )
}

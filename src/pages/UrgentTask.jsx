import React, { useState, useRef } from 'react'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

export default function UrgentTask({ onAddTodo, onNext, onBack, onGoHome }) {
  const [tasks, setTasks] = useState([''])
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const inputAreaRef = useRef(null)

  // 点击空白区域返回首页
  const handleBackgroundClick = (e) => {
    if (inputAreaRef.current?.contains(e.target)) return
    // 有内容时不返回
    if (tasks.some(t => t.trim())) return
    onGoHome()
  }

  const handleChange = (idx, val) => {
    const next = [...tasks]
    next[idx] = val
    setTasks(next)
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const next = [...tasks]
      next.push('')
      setTasks(next)
      setTimeout(() => {
        const inputs = document.querySelectorAll('.task-input')
        if (inputs[idx + 1]) inputs[idx + 1].focus()
      }, 50)
    }
  }

  const handleNext = (e) => {
    e.stopPropagation()
    const valid = tasks.map(t => t.trim()).filter(Boolean)
    valid.forEach(t => onAddTodo(t, 'urgent'))
    onNext()
  }

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="relative mb-8">
        <button
          onClick={() => {
            if (tasks.some(t => t.trim())) {
              setShowExitConfirm(true)
            } else {
              onGoHome()
            }
          }}
          className="absolute -top-4 -left-1 w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="pt-8">
          <h2 className="text-2xl font-bold text-black leading-tight">
            今天有什么事情需要完成？
          </h2>
          <span className="inline-block mt-3 bg-pink text-white text-xs font-bold px-3 py-1 rounded-full">
            紧急
          </span>
        </div>
      </div>

      {/* 输入列表 */}
      <div ref={inputAreaRef} className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {tasks.map((t, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <span className="text-pink font-bold text-lg">○</span>
            <input
              className="task-input flex-1 bg-transparent outline-none text-base text-black placeholder:text-gray-400 py-1"
              value={t}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              placeholder="输入任务..."
              autoFocus={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* 底部 */}
      <div className="mt-6 flex items-center justify-between" onMouseDown={(e) => e.stopPropagation()}>
        <BackButton onClick={onBack} />
        <Button variant="arrow" size="icon" onClick={handleNext} />
      </div>

      {/* 退出确认弹窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop">
            <p className="text-base text-black text-center mb-3">您编辑的内容将不会被<br />保存，真的要退出么？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
              >
                继续编辑
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false)
                  onGoHome()
                }}
                className="flex-1 py-2.5 rounded-full bg-pink text-white text-sm font-medium"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

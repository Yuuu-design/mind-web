import React, { useState, useRef } from 'react'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

export default function TaskInput({ onAddTodo, onBack, onGoHome }) {
  const [tasks, setTasks] = useState({
    urgent: [''],
    normal: ['']
  })
  const [activeType, setActiveType] = useState('urgent') // 'urgent' | 'normal'
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const inputAreaRef = useRef(null)

  const currentTasks = tasks[activeType]
  const hasAnyContent = tasks.urgent.some(t => t.trim()) || tasks.normal.some(t => t.trim())

  const handleChange = (type, idx, val) => {
    setTasks(prev => {
      const next = { ...prev }
      next[type] = [...next[type]]
      next[type][idx] = val
      return next
    })
  }

  const handleKeyDown = (type, idx, e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setTasks(prev => {
        const next = { ...prev }
        next[type] = [...next[type]]
        next[type].push('')
        return next
      })
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.task-input-${type}`)
        if (inputs[idx + 1]) inputs[idx + 1].focus()
      }, 50)
    }
  }

  const handleNext = () => {
    const validUrgent = tasks.urgent.map(t => t.trim()).filter(Boolean)
    const validNormal = tasks.normal.map(t => t.trim()).filter(Boolean)
    validUrgent.forEach(t => onAddTodo(t, 'urgent'))
    validNormal.forEach(t => onAddTodo(t, 'normal'))
    onGoHome()
  }

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="relative mb-8">
        <button
          onClick={() => {
            if (hasAnyContent) {
              setShowExitConfirm(true)
            } else {
              onBack()
            }
          }}
          className="absolute -top-4 -left-1 w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="pt-8">
          <h2 className="text-2xl font-bold text-black leading-tight">
            今天有什么事情需要完成？
          </h2>
        </div>
      </div>

      {/* 胶囊切换 */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-6">
        <button
          onClick={() => setActiveType('urgent')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            activeType === 'urgent'
              ? 'bg-pink text-white shadow-sm'
              : 'text-gray-500'
          }`}
        >
          紧急
        </button>
        <button
          onClick={() => setActiveType('normal')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            activeType === 'normal'
              ? 'bg-black text-white shadow-sm'
              : 'text-gray-500'
          }`}
        >
          不紧急
        </button>
      </div>

      {/* 输入列表 */}
      <div ref={inputAreaRef} className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {currentTasks.map((t, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <span className={`font-bold text-lg ${activeType === 'urgent' ? 'text-pink' : 'text-gray-400'}`}>○</span>
            <input
              className={`task-input-${activeType} flex-1 bg-transparent outline-none text-base text-black placeholder:text-gray-400 py-1`}
              value={t}
              onChange={(e) => handleChange(activeType, idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(activeType, idx, e)}
              placeholder="输入任务..."
              autoFocus={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* 底部 */}
      <div className="mt-6 flex justify-end">
        <Button variant="arrow" size="icon" onClick={handleNext} />
      </div>

      {/* 退出确认弹窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop">
            <p className="text-base text-black text-center mb-3">您编辑的内容将不会被保存，<br />真的要退出么？</p>
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

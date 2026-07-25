import React, { useState } from 'react'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

export default function UrgentTask({ onAddTodo, onNext, onBack }) {
  const [tasks, setTasks] = useState([''])

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

  const handleNext = () => {
    const valid = tasks.map(t => t.trim()).filter(Boolean)
    valid.forEach(t => onAddTodo(t, 'urgent'))
    onNext()
  }

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black leading-tight">
          今天有什么事情需要完成？
        </h2>
        <span className="inline-block mt-3 bg-pink text-white text-xs font-bold px-3 py-1 rounded-full">
          紧急
        </span>
      </div>

      {/* 输入列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
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
      <div className="mt-6 flex items-center justify-between">
        <BackButton onClick={onBack} />
        <Button variant="arrow" size="icon" onClick={handleNext} />
      </div>
    </div>
  )
}

import React, { useState } from 'react'

export default function TodoItem({ item, onComplete, onEdit, onDelete }) {
  const [exiting, setExiting] = useState(false)

  const handleComplete = (e) => {
    e.stopPropagation()
    setExiting(true)
    setTimeout(() => onComplete(item.id), 300)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(item.id)
  }

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-3 rounded-2xl transition-all duration-300
        ${exiting ? 'opacity-0 -translate-x-8 scale-95' : 'opacity-100'}
        ${item.type === 'urgent' ? 'bg-pink/10' : 'bg-gray-100'}
      `}
    >
      {/* 左侧圆圈 - 点击完成 */}
      <button
        onClick={handleComplete}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center active:scale-90 transition-transform ${
          item.type === 'urgent' ? 'border-pink' : 'border-gray-400'
        }`}
      />

      {/* 中间文字 - 双击编辑 */}
      <span
        onDoubleClick={(e) => { e.stopPropagation(); onEdit(item) }}
        className="text-sm text-black flex-1 leading-snug cursor-pointer"
      >
        {item.text}
      </span>

      {/* 右侧删除按钮 */}
      <button
        onClick={handleDelete}
        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-pink hover:bg-white/80 active:scale-90 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  )
}

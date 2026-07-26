import React, { useState, useEffect, useRef } from 'react'
import TodoItem from '../components/TodoItem'
import Modal from '../components/Modal'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import { getTodayStr } from '../utils/date'

export default function Todo({ todos, onComplete, onAddTodo, onUpdateTodo, onDeleteTodo, onDeleteUncompleted, onChangeNav }) {
  const [showNightCheck, setShowNightCheck] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [activeType, setActiveType] = useState('urgent') // 'urgent' | 'normal'
  const [showConfetti, setShowConfetti] = useState(false)
  const [prevTodosCount, setPrevTodosCount] = useState(0)
  // 行内添加状态
  const [addType, setAddType] = useState(null) // 'urgent' | 'normal' | null
  const [addText, setAddText] = useState('')
  const editInputRef = useRef(null)

  // 获取今日待办
  const today = getTodayStr()
  const todaysTodos = todos.filter(t => t.date === today && !t.completed)

  const urgentTodos = todaysTodos.filter(t => t.type === 'urgent')
  const normalTodos = todaysTodos.filter(t => t.type === 'normal')

  // 检测是否完成所有待办，触发彩带
  useEffect(() => {
    if (prevTodosCount > 0 && todaysTodos.length === 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
    setPrevTodosCount(todaysTodos.length)
  }, [todaysTodos.length])

  // 22:00 夜间检查
  useEffect(() => {
    const check = () => {
      const now = new Date()
      if (now.getHours() === 22 && now.getMinutes() === 0 && todaysTodos.length > 0) {
        setShowNightCheck(true)
      }
    }
    const timer = setInterval(check, 60000)
    return () => clearInterval(timer)
  }, [todaysTodos.length])

  // 添加待办
  const handleAdd = () => {
    if (!addText.trim()) return
    onAddTodo(addText.trim(), addType)
    setAddText('')
    setAddType(null)
  }

  // 编辑待办 - 双击进入
  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditText(item.text)
  }

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editText.trim()) return
    onUpdateTodo(editingId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  // 点击空白处保存编辑
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingId && editInputRef.current && !editInputRef.current.contains(e.target)) {
        handleSaveEdit()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editingId, editText])

  const now = new Date()

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton onClick={() => onChangeNav('home')} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black">今日待办</h1>
          <p className="text-xs text-gray-400 mt-1">专注今天，让重要的事慢慢完成</p>
        </div>
      </div>

      {/* 胶囊切换 */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-4">
        <button
          onClick={() => setActiveType('urgent')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            activeType === 'urgent'
              ? 'bg-pink text-white shadow-sm'
              : 'text-gray-500'
          }`}
        >
          紧急 {urgentTodos.length > 0 && `(${urgentTodos.length})`}
        </button>
        <button
          onClick={() => setActiveType('normal')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            activeType === 'normal'
              ? 'bg-black text-white shadow-sm'
              : 'text-gray-500'
          }`}
        >
          不紧急 {normalTodos.length > 0 && `(${normalTodos.length})`}
        </button>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 紧急列表 */}
        {activeType === 'urgent' && (
          <div
            className="bg-white rounded-card p-4 shadow-sm cursor-pointer"
            onClick={() => setAddType('urgent')}
          >
            {/* 行内添加输入框 */}
            {addType === 'urgent' && (
              <div className="flex items-center gap-2 bg-pink/10 rounded-2xl px-3 py-2 mb-2 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <input
                  value={addText}
                  onChange={(e) => setAddText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd()
                    if (e.key === 'Escape') { setAddType(null); setAddText('') }
                  }}
                  placeholder="输入紧急待办..."
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-sm text-black py-1 placeholder:text-pink/50"
                />
                <button onClick={(e) => { e.stopPropagation(); handleAdd() }} className="text-xs text-pink font-semibold px-2 py-1">确定</button>
                <button onClick={(e) => { e.stopPropagation(); setAddType(null); setAddText('') }} className="text-xs text-gray-400 px-2 py-1">取消</button>
              </div>
            )}

            <div className="space-y-2">
              {urgentTodos.length === 0 ? (
                <p className="text-xs text-gray-300 py-2 text-center">暂无紧急事项</p>
              ) : (
                urgentTodos.map(t => (
                  <div key={t.id} onMouseDown={(e) => e.stopPropagation()}>
                    {editingId === t.id ? (
                      <EditForm
                        ref={editInputRef}
                        value={editText}
                        onChange={setEditText}
                        onSave={handleSaveEdit}
                      />
                    ) : (
                      <TodoItem
                        item={t}
                        onComplete={onComplete}
                        onEdit={() => handleStartEdit(t)}
                        onDelete={onDeleteTodo}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 不紧急列表 */}
        {activeType === 'normal' && (
          <div
            className="bg-white rounded-card p-4 shadow-sm cursor-pointer"
            onClick={() => setAddType('normal')}
          >
            {/* 行内添加输入框 */}
            {addType === 'normal' && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2 mb-2 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <input
                  value={addText}
                  onChange={(e) => setAddText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd()
                    if (e.key === 'Escape') { setAddType(null); setAddText('') }
                  }}
                  placeholder="输入待办..."
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-sm text-black py-1 placeholder:text-gray-400"
                />
                <button onClick={(e) => { e.stopPropagation(); handleAdd() }} className="text-xs text-cyan font-semibold px-2 py-1">确定</button>
                <button onClick={(e) => { e.stopPropagation(); setAddType(null); setAddText('') }} className="text-xs text-gray-400 px-2 py-1">取消</button>
              </div>
            )}

            <div className="space-y-2">
              {normalTodos.length === 0 ? (
                <p className="text-xs text-gray-300 py-2 text-center">暂无不紧急事项</p>
              ) : (
                normalTodos.map(t => (
                  <div key={t.id} onMouseDown={(e) => e.stopPropagation()}>
                    {editingId === t.id ? (
                      <EditForm
                        ref={editInputRef}
                        value={editText}
                        onChange={setEditText}
                        onSave={handleSaveEdit}
                      />
                    ) : (
                      <TodoItem
                        item={t}
                        onComplete={onComplete}
                        onEdit={() => handleStartEdit(t)}
                        onDelete={onDeleteTodo}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {todaysTodos.length === 0 && (
          <div className="text-center py-16">
            <img src="/export (1).svg" alt="礼花" className="w-35 h-35 mx-auto mb-2 object-contain" />
            <p className="text-base text-gray-400">今日无事，恭喜！</p>
          </div>
        )}
      </div>

      {/* 彩带动画 */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FF527C', '#00FFFF', '#FFD700', '#FF69B4', '#00FF00', '#FF8C00'][i % 6],
                animationDelay: `${Math.random() * 0.5}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* 夜间检查弹窗 */}
      <Modal open={showNightCheck} onClose={() => setShowNightCheck(false)}>
        <div className="text-center">
          <div className="text-3xl mb-3">🌙</div>
          <h3 className="text-lg font-bold mb-2">还有未完成事项</h3>
          <p className="text-sm text-gray-500 mb-5">是否添加至明日？</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNightCheck(false)}
              className="flex-1 py-2.5 rounded-full bg-cyan text-black text-sm font-bold"
            >
              保留
            </button>
            <button
              onClick={() => {
                onDeleteUncompleted()
                setShowNightCheck(false)
              }}
              className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
            >
              删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// 编辑表单组件 - 双击编辑，Enter提交，点击空白保存
const EditForm = React.forwardRef(({ value, onChange, onSave }, ref) => {
  return (
    <div ref={ref} className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-sm animate-fade-in">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave()
        }}
        autoFocus
        className="flex-1 bg-transparent outline-none text-sm text-black py-1"
      />
    </div>
  )
})

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
  // 行内添加状态
  const [addType, setAddType] = useState(null) // 'urgent' | 'normal' | null
  const [addText, setAddText] = useState('')
  const editInputRef = useRef(null)

  // 获取今日待办
  const today = getTodayStr()
  const todaysTodos = todos.filter(t => t.date === today && !t.completed)

  const urgentTodos = todaysTodos.filter(t => t.type === 'urgent')
  const normalTodos = todaysTodos.filter(t => t.type === 'normal')

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
          <p className="text-xs text-gray-400 mt-1">
            {now.getMonth()+1}月{now.getDate()}日 · 点击完成
          </p>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        {/* 紧急 */}
        <div className="bg-white rounded-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-pink" />
            <span className="text-xs font-bold text-pink">紧急</span>
            <span className="text-[10px] text-gray-400">{urgentTodos.length} 项</span>
            {/* 添加按钮 */}
            <button
              onClick={() => setAddType('urgent')}
              className="ml-auto w-6 h-6 rounded-full bg-pink/20 flex items-center justify-center text-pink active:scale-90 transition-transform"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>

          {/* 行内添加输入框 */}
          {addType === 'urgent' && (
            <div className="flex items-center gap-2 bg-pink/10 rounded-2xl px-3 py-2 mb-2 animate-fade-in">
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
              <button onClick={handleAdd} className="text-xs text-pink font-semibold px-2 py-1">确定</button>
              <button onClick={() => { setAddType(null); setAddText('') }} className="text-xs text-gray-400 px-2 py-1">取消</button>
            </div>
          )}

          <div className="space-y-2">
            {urgentTodos.length === 0 ? (
              <p className="text-xs text-gray-300 py-2 text-center">暂无紧急事项</p>
            ) : (
              urgentTodos.map(t => (
                <div key={t.id}>
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

        {/* 不紧急 */}
        <div className="bg-white rounded-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs font-bold text-gray-500">不紧急</span>
            <span className="text-[10px] text-gray-400">{normalTodos.length} 项</span>
            {/* 添加按钮 */}
            <button
              onClick={() => setAddType('normal')}
              className="ml-auto w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>

          {/* 行内添加输入框 */}
          {addType === 'normal' && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2 mb-2 animate-fade-in">
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
              <button onClick={handleAdd} className="text-xs text-cyan font-semibold px-2 py-1">确定</button>
              <button onClick={() => { setAddType(null); setAddText('') }} className="text-xs text-gray-400 px-2 py-1">取消</button>
            </div>
          )}

          <div className="space-y-2">
            {normalTodos.length === 0 ? (
              <p className="text-xs text-gray-300 py-2 text-center">暂无不紧急事项</p>
            ) : (
              normalTodos.map(t => (
                <div key={t.id}>
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

        {todaysTodos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-sm text-gray-400">今日无事，恭喜！</p>
          </div>
        )}
      </div>

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

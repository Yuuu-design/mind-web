import React, { useState, useEffect, useRef } from 'react'
import Welcome from './pages/Welcome'
import TaskInput from './pages/TaskInput'
import Home from './pages/Home'
import Inspiration from './pages/Inspiration'
import Todo from './pages/Todo'
import Settings from './pages/Settings'
import { loadData, saveData } from './utils/storage'
import { getTodayStr } from './utils/date'
import { GlobalLoading } from './components/Loading'

// Tab 顺序（底部导航从左到右）
const TAB_ORDER = { inspiration: 0, home: 1, todo: 2 }
const TABS = new Set(['inspiration', 'home', 'todo'])
// 子页面（从主页向上滑入）
const SUB_PAGES = new Set(['welcome', 'urgent', 'settings', 'normal', 'datePicker'])

export default function App() {
  const [data, setData] = useState(loadData)
  const [page, setPage] = useState('welcome') // welcome 是入口
  const [activeDate, setActiveDate] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const prevPageRef = useRef('welcome')

  // 持久化
  useEffect(() => {
    saveData(data)
  }, [data])

  // 连续记录天数
  useEffect(() => {
    const today = new Date().toDateString()
    if (data.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      setData(prev => ({
        ...prev,
        streak: prev.lastDate === yesterday ? prev.streak + 1 : 1,
        lastDate: today
      }))
    }
  }, [])

  // 添加灵感
  const handleAddInspiration = (title, detail = '', photos = [], synthesized = false) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const newItem = {
      id: Date.now() + Math.random(),
      title,
      detail,
      photos, // [{ id, data, name }]
      date: getTodayStr(),
      time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
      synthesized
    }
    setData(prev => ({
      ...prev,
      inspirations: [newItem, ...prev.inspirations]
    }))
    if (!synthesized) {
      navigateTo('home')
    }
  }

  // 添加灵感（不跳转页面）
  const handleAddInspirationStay = (title, detail = '', photos = []) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const newItem = {
      id: Date.now() + Math.random(),
      title,
      detail,
      photos,
      date: getTodayStr(),
      time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
      synthesized: false
    }
    setData(prev => ({
      ...prev,
      inspirations: [newItem, ...prev.inspirations]
    }))
  }

  // 添加待办
  const handleAddTodo = (text, type = 'urgent') => {
    const newItem = {
      id: Date.now() + Math.random(),
      text,
      type,
      completed: false,
      date: getTodayStr()
    }
    setData(prev => ({
      ...prev,
      todos: [...prev.todos, newItem]
    }))
  }

  // 完成待办
  const handleCompleteTodo = (id) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }))
  }

  // 更新待办
  const handleUpdateTodo = (id, text) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, text } : t)
    }))
  }

  // 删除单个待办
  const handleDeleteTodo = (id) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }))
  }

  // 删除灵感（永久删除）
  const handleDeleteInspirations = (ids) => {
    setData(prev => ({
      ...prev,
      inspirations: prev.inspirations.filter(i => !ids.includes(i.id))
    }))
  }

  // 归档灵感
  const handleArchiveInspiration = (id) => {
    setData(prev => ({
      ...prev,
      inspirations: prev.inspirations.map(i =>
        i.id === id ? { ...i, archived: true } : i
      )
    }))
  }

  // 导出数据
  const handleExportData = () => {
    const exportData = {
      inspirations: data.inspirations,
      todos: data.todos,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindflow-backup-${getTodayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 夜间删除未完成
  const handleDeleteUncompleted = () => {
    const today = getTodayStr()
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.date !== today || t.completed)
    }))
  }

  // 切换深色模式
  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  // 重置数据
  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？')) {
      setData({ inspirations: [], todos: [], streak: 0, lastDate: null })
      navigateTo('welcome')
    }
  }

  // 根据导航方向决定页面切换动画
  const getPageAnimation = (from, to) => {
    const [fromPage] = from.split('?')
    const [toPage] = to.split('?')

    // 两个都是 tab 页 → 根据左右位置决定滑入方向
    if (TABS.has(fromPage) && TABS.has(toPage)) {
      return TAB_ORDER[toPage] > TAB_ORDER[fromPage]
        ? 'animate-slide-left'
        : 'animate-slide-right'
    }

    // 进入子页面 → 向上滑入
    if (SUB_PAGES.has(toPage)) {
      return 'animate-slide-up-page'
    }

    // 其他情况（返回等）→ 淡入
    return 'animate-fade-page'
  }

  const [pageAnim, setPageAnim] = useState('animate-slide-left')

  // 统一导航函数（更新动画 + 记录来源页）
  const navigateTo = (target) => {
    setPageAnim(getPageAnimation(page, target))
    prevPageRef.current = page
    setPage(target)
  }

  // 导航
  const handleChangeNav = (key) => {
    console.log('handleChangeNav called with key:', key)
    const target = key === 'plus' ? 'welcome' : key
    navigateTo(target)
  }

  // 渲染当前页面
  const renderPage = () => {
    // 解析 page 中的查询参数
    const [currentPage, queryString] = page.split('?')
    const params = new URLSearchParams(queryString || '')
    const fromInspiration = params.get('from') === 'inspiration'

    switch (currentPage) {
      case 'welcome':
        return (
          <Welcome
            onAddInspiration={handleAddInspirationStay}
            onGoUrgent={() => navigateTo('urgent')}
            onGoHome={() => navigateTo('home')}
            fromInspiration={fromInspiration}
          />
        )
      case 'urgent':
        return (
          <TaskInput
            onAddTodo={handleAddTodo}
            onBack={() => navigateTo('welcome')}
            onGoHome={() => navigateTo('home')}
          />
        )
      case 'home':
        return (
          <Home
            inspirations={data.inspirations}
            todos={data.todos}
            onSelectDate={setActiveDate}
            activeDate={activeDate}
            onChangeNav={handleChangeNav}
          />
        )
      case 'inspiration':
        return (
          <Inspiration
            items={data.inspirations}
            onAddInspiration={handleAddInspiration}
            onDeleteInspirations={handleDeleteInspirations}
            onArchiveInspiration={handleArchiveInspiration}
            onChangeNav={handleChangeNav}
          />
        )
      case 'todo':
        return (
          <Todo
            todos={data.todos}
            onComplete={handleCompleteTodo}
            onAddTodo={handleAddTodo}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
            onDeleteUncompleted={handleDeleteUncompleted}
            onChangeNav={handleChangeNav}
          />
        )
      case 'settings':
        return (
          <Settings
            inspirations={data.inspirations}
            todos={data.todos}
            streak={data.streak}
            onChangeNav={handleChangeNav}
            onResetData={handleReset}
            onExportData={handleExportData}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      <div key={page} className={`h-full w-full ${pageAnim}`}>
        {renderPage()}
      </div>
    </div>
  )
}

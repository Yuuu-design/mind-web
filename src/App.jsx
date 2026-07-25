import React, { useState, useEffect } from 'react'
import Welcome from './pages/Welcome'
import UrgentTask from './pages/UrgentTask'
import NormalTask from './pages/NormalTask'
import Home from './pages/Home'
import Inspiration from './pages/Inspiration'
import Todo from './pages/Todo'
import Settings from './pages/Settings'
import { loadData, saveData } from './utils/storage'
import { getTodayStr } from './utils/date'

export default function App() {
  const [data, setData] = useState(loadData)
  const [page, setPage] = useState('welcome') // welcome 是入口
  const [activeDate, setActiveDate] = useState(null)

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
    const newItem = {
      id: Date.now() + Math.random(),
      title,
      detail,
      photos, // [{ id, data, name }]
      date: getTodayStr(),
      synthesized
    }
    setData(prev => ({
      ...prev,
      inspirations: [newItem, ...prev.inspirations]
    }))
    if (!synthesized) {
      setPage('home')
    }
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

  // 夜间删除未完成
  const handleDeleteUncompleted = () => {
    const today = getTodayStr()
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.date !== today || t.completed)
    }))
  }

  // 重置数据
  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？')) {
      setData({ inspirations: [], todos: [], streak: 0, lastDate: null })
      setPage('welcome')
    }
  }

  // 导航
  const handleChangeNav = (key) => {
    if (key === 'plus') {
      setPage('welcome')
    } else {
      setPage(key)
    }
  }

  // 渲染当前页面
  const renderPage = () => {
    switch (page) {
      case 'welcome':
        return (
          <Welcome
            onAddInspiration={handleAddInspiration}
            onGoUrgent={() => setPage('urgent')}
          />
        )
      case 'urgent':
        return (
          <UrgentTask
            onAddTodo={handleAddTodo}
            onNext={() => setPage('normal')}
            onBack={() => setPage('welcome')}
          />
        )
      case 'normal':
        return (
          <NormalTask
            onAddTodo={handleAddTodo}
            onNext={() => setPage('home')}
            onBack={() => setPage('urgent')}
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
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {renderPage()}
    </div>
  )
}

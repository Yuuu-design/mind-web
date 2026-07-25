import { useState, useEffect } from 'react'
import { loadData, saveData } from '../utils/storage'

// 数据管理 Hook
export function useData() {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  // 添加灵感
  const addInspiration = (title, detail = '') => {
    const now = new Date()
    const newItem = {
      id: Date.now() + Math.random(),
      title,
      detail,
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    }
    setData(prev => ({
      ...prev,
      inspirations: [newItem, ...prev.inspirations]
    }))
  }

  // 添加待办
  const addTodo = (text, type = 'urgent') => {
    const newItem = {
      id: Date.now() + Math.random(),
      text,
      type, // urgent | normal
      completed: false
    }
    setData(prev => ({
      ...prev,
      todos: [...prev.todos, newItem]
    }))
  }

  // 完成待办
  const completeTodo = (id) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }))
  }

  // 重置数据
  const resetData = () => {
    setData({ inspirations: [], todos: [], streak: 0, lastDate: null })
  }

  return {
    data,
    addInspiration,
    addTodo,
    completeTodo,
    resetData
  }
}

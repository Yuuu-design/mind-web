// 日期工具函数

// 获取当前日期字符串 YYYY-MM-DD
export function getTodayStr() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// 获取当前日期对象
export function getToday() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  }
}

// 格式化日期显示
export function formatDate(date) {
  if (!date) return ''
  if (typeof date === 'string') return date
  return `${date.year}年${date.month}月${date.day}日`
}

// 比较两个日期是否相同
export function isSameDate(a, b) {
  if (!a || !b) return false
  const strA = typeof a === 'string' ? a : `${a.year}-${String(a.month).padStart(2,'0')}-${String(a.day).padStart(2,'0')}`
  const strB = typeof b === 'string' ? b : `${b.year}-${String(b.month).padStart(2,'0')}-${String(b.day).padStart(2,'0')}`
  return strA === strB
}

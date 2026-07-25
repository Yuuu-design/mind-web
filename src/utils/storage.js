// LocalStorage 封装
const STORAGE_KEY = 'mindflow_data'

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return { inspirations: [], todos: [], streak: 0, lastDate: null }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY)
}

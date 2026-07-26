import React, { useState, useMemo } from 'react'
import InspirationCard from '../components/InspirationCard'
import Modal from '../components/Modal'
import { synthesizeIdeas } from '../data/mockAI'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import ImageWithLoader from '../components/ImageWithLoader'

export default function Inspiration({ items, onAddInspiration, onDeleteInspirations, onArchiveInspiration, onChangeNav }) {
  const [selected, setSelected] = useState([])
  const [synthesizing, setSynthesizing] = useState(false)
  const [result, setResult] = useState(null)
  const [editable, setEditable] = useState({ title: '', detail: '' })
  const [showLibrary, setShowLibrary] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 随机排序 + 搜索过滤（排除已合成的灵感）
  const shuffled = useMemo(() => {
    let arr = items.filter(i => !i.synthesized)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      arr = arr.filter(i =>
        i.title.toLowerCase().includes(query) ||
        (i.detail && i.detail.toLowerCase().includes(query))
      )
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [items, searchQuery])

  console.log('Inspiration page - items:', items, 'shuffled:', shuffled)
  console.log('Inspiration page - rendering, items length:', items.length)

  // 合成库
  const synthesizedItems = useMemo(() => {
    return items.filter(i => i.synthesized)
  }, [items])

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSynthesize = () => {
    if (selected.length < 2) return
    setSynthesizing(true)
    const selectedItems = items.filter(i => selected.includes(i.id))
    setTimeout(() => {
      const res = synthesizeIdeas(selectedItems)
      setEditable({ title: res.title, detail: res.detail })
      setResult(res)
      setSynthesizing(false)
    }, 800)
  }

  const handleSubmitResult = () => {
    // 保存到 inspirations，标记为合成（不跳转页面）
    onAddInspiration(editable.title, editable.detail, [], true)
    setResult(null)
    setEditable({ title: '', detail: '' })
    // 弹出确认是否删除选中的灵感
    setShowDeleteConfirm(true)
  }

  // 确认删除选中的灵感
  const handleConfirmDelete = () => {
    onDeleteInspirations(selected)
    setSelected([])
    setShowDeleteConfirm(false)
  }

  // 取消删除，保留灵感
  const handleCancelDelete = () => {
    setSelected([])
    setShowDeleteConfirm(false)
  }

  const handleCancel = () => {
    setResult(null)
    setEditable({ title: '', detail: '' })
  }

  // 删除选中的灵感（移入归档）
  const handleDeleteSelected = () => {
    if (selected.length === 0) return
    onDeleteInspirations(selected)
    setSelected([])
  }

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8">
      {/* 顶部 */}
      <div className="flex items-center gap-4 mb-5">
        <BackButton onClick={() => onChangeNav('home')} />
        <h1 className="text-2xl font-bold text-black flex-1">灵感</h1>
        <button
          onClick={() => setShowLibrary(true)}
          className="w-10 h-10 flex items-center justify-center text-gray-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </button>
      </div>

      {/* 搜索框 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索灵感..."
            className="flex-1 bg-transparent outline-none text-sm text-black placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 灵感卡片列表 - 随机分布 */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4 pt-1">
        {shuffled.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ImageWithLoader src={'/export (2).svg'} alt="暂无灵感" className="w-35 h-35 object-contain" />
          </div>
        ) : (
          shuffled.map(item => (
            <InspirationCard
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              onToggle={toggleSelect}
              onDelete={(id) => onDeleteInspirations([id])}
              onArchive={onArchiveInspiration}
            />
          ))
        )}
      </div>

      {/* 底部选择栏 - 选中后才出现 */}
      {selected.length > 0 && !result && (
        <div className="absolute bottom-20 left-0 right-0 px-6 pb-3 animate-slide-up">
          <div className="bg-white rounded-card p-4 shadow-lg border border-gray-100 flex items-center gap-3">
            <span className="text-xs text-gray-500 flex-1">
              已选 {selected.length} 个灵感
            </span>
            <Button variant="light" size="sm" onClick={handleDeleteSelected}>
              删除
            </Button>
            {selected.length >= 2 ? (
              <Button variant="primary" size="sm" onClick={handleSynthesize}>
                合成
              </Button>
            ) : (
              <Button variant="light" size="sm" onClick={() => {}}>
                继续添加
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 合成中 */}
      <Modal open={synthesizing} onClose={() => {}}>
        <div className="text-center py-4">
          <div className="w-10 h-10 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">正在合成灵感...</p>
        </div>
      </Modal>

      {/* 合成结果 - 可编辑 */}
      <Modal open={!!result} onClose={handleCancel}>
        {result && (
          <div>
            <h3 className="text-lg font-bold mb-3">灵感合成结果</h3>
            <div className="bg-cyan/10 rounded-2xl p-4 mb-4 space-y-3">
              <input
                value={editable.title}
                onChange={(e) => setEditable(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-transparent font-semibold text-base outline-none border-b border-cyan/30 pb-2"
                placeholder="标题"
              />
              <textarea
                value={editable.detail}
                onChange={(e) => setEditable(prev => ({ ...prev, detail: e.target.value }))}
                className="w-full bg-transparent text-sm text-gray-600 leading-relaxed outline-none resize-none min-h-[80px]"
                placeholder="详细内容"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="light" size="sm" onClick={handleCancel} className="flex-1">
                取消
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmitResult} className="flex-1">
                提交
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 合成库 */}
      <Modal open={showLibrary} onClose={() => setShowLibrary(false)}>
        <h3 className="text-lg font-bold mb-3">合成灵感库</h3>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
          {synthesizedItems.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">还没有合成记录</p>
          ) : (
            synthesizedItems.map(i => (
              <div key={i.id} className="bg-cyan/10 rounded-2xl p-4">
                <div className="font-medium text-sm">{i.title}</div>
                {i.detail && <div className="text-xs text-gray-500 mt-1">{i.detail}</div>}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setShowLibrary(false)}
          className="mt-4 w-full bg-cyan text-black rounded-full py-2 text-sm font-bold"
        >
          关闭
        </button>
      </Modal>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop">
            <p className="text-base text-black text-center mb-5">是否删除之前选中的灵感？</p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
              >
                保留
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-full bg-pink text-white text-sm font-medium"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

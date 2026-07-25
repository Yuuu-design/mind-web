import React, { useState, useMemo } from 'react'
import InspirationCard from '../components/InspirationCard'
import Modal from '../components/Modal'
import { synthesizeIdeas } from '../data/mockAI'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

export default function Inspiration({ items, onAddInspiration, onDeleteInspirations, onArchiveInspiration, onChangeNav }) {
  const [selected, setSelected] = useState([])
  const [synthesizing, setSynthesizing] = useState(false)
  const [result, setResult] = useState(null)
  const [editable, setEditable] = useState({ title: '', detail: '' })
  const [showLibrary, setShowLibrary] = useState(false)

  // 随机排序 - 排除已归档
  const shuffled = useMemo(() => {
    const arr = items.filter(i => !i.archived)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [items])

  console.log('Inspiration page - items:', items, 'shuffled:', shuffled)

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
    // 保存到 inspirations，标记为合成
    onAddInspiration(editable.title, editable.detail, true)
    setResult(null)
    setEditable({ title: '', detail: '' })
    setSelected([])
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
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="flex items-center gap-4 mb-5">
        <BackButton onClick={() => onChangeNav('home')} />
        <h1 className="text-2xl font-bold text-black flex-1">灵感</h1>
        <button
          onClick={() => setShowLibrary(true)}
          className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200"
        >
          合成库
        </button>
      </div>

      {/* 灵感卡片列表 - 随机分布 */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
        {shuffled.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            还没有灵感，先去记录吧 ✨
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

    </div>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function InspirationCard({ item, selected, onToggle, onDelete, onArchive }) {
  const [expanded, setExpanded] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const menuRef = useRef(null)

  // 点击空白处关闭菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  return (
    <div
      className={`
        bg-white rounded-card p-5 shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]
        ${selected ? 'ring-2 ring-cyan shadow-lg' : 'hover:shadow-md'}
      `}
    >
      {/* 卡片主体 */}
      <div className="flex items-start justify-between gap-3">
        {/* 标题区域 - 点击展开/收起 */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <h3 className="font-semibold text-black text-base leading-snug">
            {item.title}
          </h3>
          {/* 展开后显示详细内容 - 保留换行格式 */}
          {expanded && item.detail && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed animate-fade-in whitespace-pre-wrap">
              {item.detail}
            </p>
          )}
        </div>

        {/* 选择标记 - 点击选中/取消 */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(item.id) }}
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 cursor-pointer
            ${selected ? 'bg-cyan border-cyan' : 'border-gray-300 hover:border-gray-400'}
          `}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          )}
        </button>
      </div>

      {/* 展开后显示照片 */}
      {expanded && item.photos && item.photos.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap animate-fade-in">
          {item.photos.map(p => (
            <div
              key={p.id}
              onClick={(e) => {
                e.stopPropagation()
                setPreviewPhoto(p)
              }}
              className="w-14 h-14 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              <img src={p.data} alt={p.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* 底部：时间 + 更多按钮 */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          {item.time || item.date || ''}
        </span>

        {/* 更多按钮 - 三个点 */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>

          {/* 功能菜单弹出 */}
          {showMenu && (
            <div ref={menuRef} className="absolute -top-2 right-0 bg-white rounded-2xl shadow-xl p-2 w-36 animate-pop z-50" style={{ transform: 'translateY(-100%)' }}>
              {/* 分享 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  alert('分享功能在完整版中启用')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <span className="text-sm text-black">分享</span>
              </button>

              {/* 置顶 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  alert('置顶功能在完整版中启用')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <span className="text-sm text-black">置顶</span>
              </button>

              {/* 归档 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  onArchive(item.id)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
                <span className="text-sm text-black">归档</span>
              </button>

              {/* 删除 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  setShowDeleteDialog(true)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink">
                  <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                <span className="text-sm text-pink">删除</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 照片预览弹窗 - 使用 Portal 渲染到 body */}
      {previewPhoto && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/70 animate-fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <img
            src={previewPhoto.data}
            alt={previewPhoto.name}
            className="max-w-full max-h-full rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}

      {/* 删除确认弹窗 */}
      {showDeleteDialog && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop" onClick={(e) => e.stopPropagation()}>
            <p className="text-base text-black text-center mb-2">是否删除这条灵感？</p>
            <p className="text-sm text-pink text-center mb-5">删除后将无法找回</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
              >
                保留
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  onDelete(item.id)
                }}
                className="flex-1 py-2.5 rounded-full bg-pink text-white text-sm font-medium"
              >
                删除
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

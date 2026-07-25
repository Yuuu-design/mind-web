import React, { useState } from 'react'

export default function InspirationCard({ item, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState(null)

  return (
    <div
      className={`
        bg-white rounded-card p-5 shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]
        ${selected ? 'ring-2 ring-cyan shadow-lg' : 'hover:shadow-md'}
      `}
    >
      {/* 卡片主体 - 点击切换选择状态 */}
      <div onClick={() => onToggle(item.id)} className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-black text-base leading-snug">
            {item.title}
          </h3>
          {/* 默认只显示概括，展开后显示详细内容 */}
          {expanded && item.detail && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed animate-fade-in">
              {item.detail}
            </p>
          )}
        </div>

        {/* 选择标记 */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5
          ${selected ? 'bg-cyan border-cyan' : 'border-gray-300'}
        `}>
          {selected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          )}
        </div>
      </div>

      {/* 照片预览 */}
      {item.photos && item.photos.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
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

      {/* 底部：日期 + 展开按钮 */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          {item.date || ''}
          {item.photos && item.photos.length > 0 && ` · ${item.photos.length}张照片`}
        </span>

        {/* 右下角：展开/收起按钮 */}
        {(item.detail || (item.photos && item.photos.length > 0)) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="text-[10px] text-cyan font-semibold flex items-center gap-1"
          >
            {expanded ? '收起' : '展开'}
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        )}
      </div>

      {/* 照片预览弹窗 */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 animate-fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <img
            src={previewPhoto.data}
            alt={previewPhoto.name}
            className="max-w-full max-h-full rounded-2xl"
          />
        </div>
      )}
    </div>
  )
}

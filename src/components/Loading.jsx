import React from 'react'

// 全局加载动画
export function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// 上传加载动画
export function UploadLoading() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="w-4 h-4 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      <span>上传中...</span>
    </div>
  )
}

// 保存成功反馈
export function SaveSuccess() {
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        保存成功
      </div>
    </div>
  )
}

// 页面切换加载
export function PageLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

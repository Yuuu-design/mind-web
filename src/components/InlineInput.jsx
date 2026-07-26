import React, { useRef, useEffect, useState, forwardRef } from 'react'

const InlineInput = forwardRef(function InlineInput({ value, onChange, placeholder, photos, onRemovePhoto, className = '' }, ref) {
  const editorRef = useRef(null)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== value) {
      editorRef.current.innerText = value
    }
  }, [])

  const handleInput = () => {
    const text = editorRef.current?.innerText || ''
    onChange(text)
    setIsEmpty(text.trim().length === 0)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (range.startOffset === 0 && range.endOffset === 0) {
          const prevNode = range.startContainer.previousSibling
          if (prevNode && prevNode.classList?.contains('inline-media')) {
            const photoId = prevNode.dataset.id
            onRemovePhoto(parseFloat(photoId))
            e.preventDefault()
          }
        }
      }
    }
  }

  const insertMedia = (photo) => {
    const isVideo = photo.type === 'video'
    const isAudio = photo.type === 'audio'

    const container = document.createElement('span')
    container.className = 'inline-media'
    container.dataset.id = photo.id
    container.style.cssText = 'display:inline-block;width:60px;height:60px;border-radius:8px;margin:0 4px;vertical-align:middle;position:relative;overflow:hidden;'

    if (isVideo) {
      // 视频显示为带播放图标的缩略图
      container.innerHTML = `
        <div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      `
    } else if (isAudio) {
      // 音频显示为波形图标
      container.innerHTML = `
        <div style="width:100%;height:100%;background:#00FFFF;display:flex;align-items:center;justify-content:center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      `
    } else {
      // 图片直接显示
      const img = document.createElement('img')
      img.src = photo.data
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;'
      container.appendChild(img)
    }

    container.contentEditable = false

    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.insertNode(container)
      range.collapse(false)
      handleInput()
    }
  }

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref.current = { insertMedia }
      } else {
        ref.current = { insertMedia }
      }
    }
  }, [ref])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className="w-full min-h-[120px] outline-none text-base text-black leading-relaxed break-words [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400"
      />
    </div>
  )
})

export default InlineInput

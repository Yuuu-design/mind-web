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
      // 处理删除图片的逻辑
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (range.startOffset === 0 && range.endOffset === 0) {
          const prevNode = range.startContainer.previousSibling
          if (prevNode && prevNode.classList?.contains('inline-image')) {
            const photoId = prevNode.dataset.id
            onRemovePhoto(parseFloat(photoId))
            e.preventDefault()
          }
        }
      }
    }
  }

  const insertImage = (photo) => {
    const img = document.createElement('img')
    img.src = photo.data
    img.className = 'inline-image'
    img.dataset.id = photo.id
    img.style.cssText = 'display:inline-block;width:60px;height:60px;border-radius:8px;margin:0 4px;object-fit:cover;vertical-align:middle;'
    img.contentEditable = false

    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.insertNode(img)
      range.collapse(false)
      handleInput()
    }
  }

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref.current = { insertImage }
      } else {
        ref.current = { insertImage }
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

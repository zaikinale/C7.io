import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { RiShareBoxLine } from "react-icons/ri";
import { LuLink } from "react-icons/lu";
import { GoShareAndroid } from "react-icons/go";


export default function MarkdownNoteModal({ isOpen, onClose, onSave }) {
  const [content, setContent] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) textareaRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const insertMarkdown = (prefix, suffix = prefix) => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = content
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end)
    
    setContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (end - start))
    }, 0)
  }

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim())
      setContent('')
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="md-modal-overlay">
      <div className="md-modal-backdrop" onClick={onClose} />
      <div className="md-modal-window">
        <div className="md-modal-header">
          <input className='md-modal-input' type='text' placeholder='Новая заметка' />
          <button className="md-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="md-modal-meta">
            <p>Created at: 9.09.2026</p>
        </div>

        <textarea
          ref={textareaRef}
          className="md-modal-textarea"
          placeholder="Введите текст заметки (поддерживается Markdown)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="md-modal-toolbar">
            <button className='btn' type="button" onClick={() => insertMarkdown('**', '**')} title="Жирный"><b>B</b></button>
            <button className='btn' type="button" onClick={() => insertMarkdown('*', '*')} title="Курсив"><i>I</i></button>
            <button className='btn' type="button" onClick={() => insertMarkdown('`', '`')} title="Код">&lt;/&gt;</button>
            <button className='btn' type="button" onClick={() => insertMarkdown('- ')} title="Список">•</button>
            <button className='btn' type="button" onClick={() => insertMarkdown('# ')} title="Заголовок">H1</button>
            <button className='btn' type="button" onClick={() => insertMarkdown('[', '](url)')} title="Ссылка"><LuLink /></button>
            <button className='btn' type="button" onClick={() => insertMarkdown('[', '](url)')} title="Ссылка"><RiShareBoxLine /></button>
            <button className='btn' type="button" onClick={() => insertMarkdown('[', '](url)')} title="Ссылка"><GoShareAndroid /></button>
            <div className="md-modal-footer">
                <button className="md-btn md-btn-secondary" onClick={onClose}>Отмена</button>
                <button className="md-btn md-btn-primary" onClick={handleSave}>Сохранить</button>
            </div>
        </div>

        {/* <div className="md-modal-footer">
          
        </div> */}
      </div>
    </div>,
    document.body
  )
}
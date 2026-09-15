import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { RiShareBoxLine } from "react-icons/ri"
import { LuLink } from "react-icons/lu"
import { TiPin, TiPinOutline } from "react-icons/ti"
import { PiSelection } from "react-icons/pi"
import { IoAddOutline } from "react-icons/io5"
import { FaRegNoteSticky, FaRegUser } from "react-icons/fa6"
import { GoShareAndroid } from "react-icons/go"
import { IoStar, IoHeart, IoBookmark, IoFlash, IoRocket, IoCode, IoBriefcase, IoSchool, IoFitness, IoMusicalNotes } from "react-icons/io5"

const COLORS = [
  { name: 'default', value: 'rgb(12, 12, 12)' },
  { name: 'blue', value: '#1e3a5f' },
  { name: 'green', value: '#1a4d2e' },
  { name: 'purple', value: '#3d1f5c' },
  { name: 'orange', value: '#5c3a1f' },
  { name: 'red', value: '#5c1f1f' },
]

const ICONS = [
  { name: 'star', Icon: IoStar },
  { name: 'heart', Icon: IoHeart },
  { name: 'bookmark', Icon: IoBookmark },
  { name: 'flash', Icon: IoFlash },
  { name: 'rocket', Icon: IoRocket },
  { name: 'code', Icon: IoCode },
  { name: 'briefcase', Icon: IoBriefcase },
  { name: 'school', Icon: IoSchool },
  { name: 'fitness', Icon: IoFitness },
  { name: 'music', Icon: IoMusicalNotes },
]

const AVAILABLE_TASKS = [
  { id: 1, text: 'Сделать макет дашборда', done: true },
  { id: 2, text: 'Написать API-запросы', done: false },
  { id: 3, text: 'Code review PR #42', done: false },
  { id: 4, text: 'Обновить зависимости', done: false },
]

const AVAILABLE_USERS = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Сидорова', email: 'maria@example.com' },
  { id: 3, name: 'Алексей Козлов', email: 'alex@example.com' },
  { id: 4, name: 'Елена Новикова', email: 'elena@example.com' },
]

const AVAILABLE_NOTES = [
  { id: 1, title: 'Идеи для проекта', text: 'Не забыть обновить зависимости проекта' },
  { id: 2, title: 'Встреча с клиентом', text: 'Обсудить требования к новому функционалу' },
  { id: 3, title: 'Техническое задание', text: 'API должно поддерживать REST и GraphQL' },
]

export default function MarkdownNoteModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [links, setLinks] = useState([])
  const [newLink, setNewLink] = useState('')
  const [selectedTasks, setSelectedTasks] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedNotes, setSelectedNotes] = useState([])
  const [isPinned, setIsPinned] = useState(false)
  const [color, setColor] = useState(COLORS[0].value)
  const [icon, setIcon] = useState(null)
  const [isOpenCastomize, setIsOpenCastomize] = useState(false)
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false)
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false)
  const [isNotePickerOpen, setIsNotePickerOpen] = useState(false)
  const [isOpenLinkPanel, setIsOpenLinkPanel] = useState(false)
  
  const textareaRef = useRef(null)
  const linkInputRef = useRef(null)
  const taskPickerRef = useRef(null)
  const userPickerRef = useRef(null)
  const notePickerRef = useRef(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) textareaRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Закрытие dropdown при клике вне их
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (taskPickerRef.current && !taskPickerRef.current.contains(e.target)) {
        setIsTaskPickerOpen(false)
      }
      if (userPickerRef.current && !userPickerRef.current.contains(e.target)) {
        setIsUserPickerOpen(false)
      }
      if (notePickerRef.current && !notePickerRef.current.contains(e.target)) {
        setIsNotePickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const addLink = () => {
    const url = newLink.trim()
    if (url && !links.includes(url)) {
      setLinks([...links, url])
      setNewLink('')
      linkInputRef.current?.focus()
    }
  }

  const removeLink = (url) => {
    setLinks(links.filter(l => l !== url))
  }

  const toggleTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleNote = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    )
  }

  const removeTask = (taskId) => {
    setSelectedTasks(prev => prev.filter(id => id !== taskId))
  }

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId))
  }

  const removeNote = (noteId) => {
    setSelectedNotes(prev => prev.filter(id => id !== noteId))
  }

  const handleSave = () => {
    if (content.trim() || title.trim()) {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        links,
        tasks: selectedTasks,
        users: selectedUsers,
        notes: selectedNotes,
        isPinned,
        color,
        icon,
        createdAt: new Date().toISOString(),
      }
      onSave(noteData)
      
      setTitle('')
      setContent('')
      setLinks([])
      setSelectedTasks([])
      setSelectedUsers([])
      setSelectedNotes([])
      setIsPinned(false)
      setColor(COLORS[0].value)
      setIcon(null)
      onClose()
    }
  }

  if (!isOpen) return null

  const SelectedIcon = icon ? ICONS.find(i => i.name === icon)?.Icon : null

  return createPortal(
    <div className="md-modal-overlay">
      <div className="md-modal-backdrop" onClick={onClose} />
      <div className="md-modal-window" style={{ backgroundColor: color }}>
        <div className="md-modal-header">
          <div className="md-modal-title-row">
            {SelectedIcon ? <SelectedIcon onClick={() => setIsOpenCastomize(!isOpenCastomize)} className="md-modal-icon" /> : <PiSelection onClick={() => setIsOpenCastomize(!isOpenCastomize)} className="md-modal-icon" />}
            <input 
              className="md-modal-title-input" 
              type="text" 
              placeholder="Заголовок заметки" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="md-modal-header-actions">
            <button 
              className={`md-modal-pin ${isPinned ? 'active' : ''}`} 
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Открепить' : 'Закрепить'}
            >
              {isPinned ? <TiPinOutline /> : <TiPin />}
            </button>
            <button className="md-modal-close" onClick={onClose}>×</button>
          </div>
        </div>
        
        {isOpenCastomize && (
          <div className="md-modal-appearance">
            <div className="md-modal-colors">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  className={`md-modal-color-btn ${color === c.value ? 'active' : ''}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                />
              ))}
            </div>
            
            <div className="md-modal-icons">
              {ICONS.map(({ name, Icon }) => (
                <button
                  key={name}
                  className={`md-modal-icon-btn ${icon === name ? 'active' : ''}`}
                  onClick={() => setIcon(icon === name ? null : name)}
                  title={name}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="md-modal-meta">
          <p>Создано: {new Date().toLocaleDateString('ru-RU')}</p>
        </div>

        <textarea
          ref={textareaRef}
          className="md-modal-textarea"
          placeholder="Введите текст..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Секция ссылок */}
        {links.length > 0 && (
          <div className="md-modal-section">
            <h4>Прикреплённые ссылки</h4>
            <div className="md-modal-links">
              {links.map((link, idx) => (
                <div key={idx} className="md-modal-link-item">
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  <button onClick={() => removeLink(link)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Секция прикреплённых элементов */}
        <div className="md-modal-section">
          {/* Выбранные задачи */}
          {selectedTasks.length > 0 && (
            <div className="md-modal-selected-tasks">
              {selectedTasks.map(taskId => {
                const task = AVAILABLE_TASKS.find(t => t.id === taskId)
                return (
                  <div key={taskId} className="md-modal-task-tag">
                    <GoShareAndroid />
                    <span>{task.text}</span>
                    <button onClick={() => removeTask(taskId)}>×</button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Выбранные пользователи */}
          {selectedUsers.length > 0 && (
            <div className="md-modal-selected-users">
              {selectedUsers.map(userId => {
                const user = AVAILABLE_USERS.find(u => u.id === userId)
                return (
                  <div key={userId} className="md-modal-user-tag">
                    <FaRegUser />
                    <span>{user.name}</span>
                    <button onClick={() => removeUser(userId)}>×</button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Выбранные заметки */}
          {selectedNotes.length > 0 && (
            <div className="md-modal-selected-notes">
              {selectedNotes.map(noteId => {
                const note = AVAILABLE_NOTES.find(n => n.id === noteId)
                return (
                  <div key={noteId} className="md-modal-note-tag">
                    <FaRegNoteSticky />
                    <span>{note.title}</span>
                    <button onClick={() => removeNote(noteId)}>×</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Панель инструментов */}
        <div className="md-modal-toolbar">
          <div className="md-modal-picker" ref={userPickerRef}>
            <button 
              className="btn" 
              type="button" 
              onClick={() => setIsUserPickerOpen(!isUserPickerOpen)} 
              title="Дать доступ"
            >
              <FaRegUser />
            </button>
            {isUserPickerOpen && (
              <div className="md-modal-dropdown">
                <h5>Выберите пользователей</h5>
                {AVAILABLE_USERS.map(user => (
                  <label key={user.id} className="md-modal-dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                    <span>{user.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button 
            className="btn" 
            type="button" 
            onClick={() => setIsOpenLinkPanel(!isOpenLinkPanel)} 
            title="Прикрепить ссылку"
          >
            <LuLink />
          </button>

          <div className="md-modal-picker" ref={notePickerRef}>
            <button 
              className="btn" 
              type="button" 
              onClick={() => setIsNotePickerOpen(!isNotePickerOpen)} 
              title="Прикрепить заметку"
            >
              <FaRegNoteSticky />
            </button>
            {isNotePickerOpen && (
              <div className="md-modal-dropdown">
                <h5>Связать с заметками</h5>
                {AVAILABLE_NOTES.map(note => (
                  <label key={note.id} className="md-modal-dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => toggleNote(note.id)}
                    />
                    <div className="md-modal-dropdown-note-info">
                      <span className="md-modal-dropdown-note-title">{note.title}</span>
                      <span className="md-modal-dropdown-note-text">{note.text}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="md-modal-picker" ref={taskPickerRef}>
            <button 
              className="btn" 
              type="button" 
              onClick={() => setIsTaskPickerOpen(!isTaskPickerOpen)} 
              title="Прикрепить задачу"
            >
              <GoShareAndroid />
            </button>
            {isTaskPickerOpen && (
              <div className="md-modal-dropdown">
                <h5>Прикрепить задачи</h5>
                {AVAILABLE_TASKS.map(task => (
                  <label key={task.id} className="md-modal-dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span>{task.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button className="btn" type="button" onClick={() => insertMarkdown('[', '](url)')} title="Поделиться">
            <RiShareBoxLine />
          </button>
          <div className="md-modal-footer">
          <button className="md-btn md-btn-secondary" onClick={onClose}>Отмена</button>
          <button className="md-btn md-btn-primary" onClick={handleSave}>Сохранить</button>
        </div>
        </div>

        {isOpenLinkPanel && (
          <div className="md-modal-link-input-row">
            <input
              ref={linkInputRef}
              type="url"
              placeholder="Добавить ссылку"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLink()}
            />
            <button onClick={addLink}><IoAddOutline /></button>
          </div>
        )}

        
      </div>
    </div>,
    document.body
  )
}
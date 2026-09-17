import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import './Modal.css'

import { RiShareBoxLine } from "react-icons/ri"
import { LuLink } from "react-icons/lu"
import { TiPin, TiPinOutline } from "react-icons/ti"
import { PiSelection } from "react-icons/pi"
import { IoAddOutline } from "react-icons/io5"
import { FaRegNoteSticky, FaRegUser } from "react-icons/fa6"
import { GoShareAndroid } from "react-icons/go"
// ИСПРАВЛЕНО: HiOutlineMenu заменён на HiBars3
import { HiOutlineFolder, HiOutlinePlus, HiBars3 } from "react-icons/hi2" 
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

const INITIAL_GROUPS = [
  { id: 1, name: 'Работа', description: '', users: [], notes: [] },
  { id: 2, name: 'Личное', description: '', users: [], notes: [] },
  { id: 3, name: 'Учёба', description: '', users: [], notes: [] },
]

export default function MarkdownNoteModal({ isOpen, onClose, onSave }) {
  const navigate = useNavigate()
  
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
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().split('T')[0])
  const [deadline, setDeadline] = useState('')
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false)
  
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [selectedGroup, setSelectedGroup] = useState('')
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [newGroupUsers, setNewGroupUsers] = useState([])
  const [newGroupNotes, setNewGroupNotes] = useState([])

  // --- Drag & Drop State ---
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const isDraggingRef = useRef(false) // Защита от случайного клика после перетаскивания

  const textareaRef = useRef(null)
  const linkInputRef = useRef(null)
  const taskPickerRef = useRef(null)
  const userPickerRef = useRef(null)
  const notePickerRef = useRef(null)

  const activeGroup = groups.find(g => String(g.id) === selectedGroup)

  const totalTasks = selectedTasks.length
  const completedTasks = selectedTasks.filter(id => AVAILABLE_TASKS.find(t => t.id === id)?.done).length
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  useEffect(() => {
    if (isOpen && textareaRef.current) textareaRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { 
      if (e.key === 'Escape') {
        if (isGroupModalOpen) setIsGroupModalOpen(false)
        else if (isDeadlineOpen) setIsDeadlineOpen(false)
        else onClose()
      }
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose, isGroupModalOpen, isDeadlineOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (taskPickerRef.current && !taskPickerRef.current.contains(e.target)) setIsTaskPickerOpen(false)
      if (userPickerRef.current && !userPickerRef.current.contains(e.target)) setIsUserPickerOpen(false)
      if (notePickerRef.current && !notePickerRef.current.contains(e.target)) setIsNotePickerOpen(false)
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

  const removeLink = (url) => setLinks(links.filter(l => l !== url))
  const toggleTask = (taskId) => setSelectedTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId])
  const toggleUser = (userId) => setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId])
  const toggleNote = (noteId) => setSelectedNotes(prev => prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId])
  const removeTask = (taskId) => setSelectedTasks(prev => prev.filter(id => id !== taskId))
  const removeUser = (userId) => setSelectedUsers(prev => prev.filter(id => id !== userId))
  const removeNote = (noteId) => setSelectedNotes(prev => prev.filter(id => id !== noteId))

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e, taskId) => {
    isDraggingRef.current = true
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault() // Обязательно для разрешения drop
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault()
    if (!draggedTaskId || draggedTaskId === targetTaskId) return

    setSelectedTasks(prev => {
      const newTasks = [...prev]
      const dragIndex = newTasks.indexOf(draggedTaskId)
      const dropIndex = newTasks.indexOf(targetTaskId)

      // Удаляем из старой позиции и вставляем в новую
      const [removed] = newTasks.splice(dragIndex, 1)
      newTasks.splice(dropIndex, 0, removed)

      return newTasks
    })
    setDraggedTaskId(null)
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
    setDraggedTaskId(null)
  }

  const handleTaskClick = (e, taskId) => {
    // Если это был drag, а не клик, игнорируем переход
    if (isDraggingRef.current) {
      e.preventDefault()
      return
    }
    navigate(`/tasks/${taskId}`)
  }
  // -------------------------

  const handleCreateGroup = () => {
    const name = newGroupName.trim()
    if (!name) return
    
    const newGroup = {
      id: Date.now(),
      name,
      description: newGroupDesc.trim(),
      users: newGroupUsers,
      notes: newGroupNotes
    }
    
    setGroups([...groups, newGroup])
    setSelectedGroup(String(newGroup.id))
    setNewGroupName('')
    setNewGroupDesc('')
    setNewGroupUsers([])
    setNewGroupNotes([])
    setIsGroupModalOpen(false)
  }

  const handleSave = () => {
    if (content.trim() || title.trim()) {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        links,
        tasks: selectedTasks, // Порядок здесь теперь сохраняется!
        users: selectedUsers,
        notes: selectedNotes,
        isPinned,
        color,
        icon,
        createdAt,
        deadline: deadline || null,
        group: selectedGroup || null,
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
      setCreatedAt(new Date().toISOString().split('T')[0])
      setDeadline('')
      setIsDeadlineOpen(false)
      setSelectedGroup('')
      onClose()
    }
  }

  if (!isOpen) return null

  const SelectedIcon = icon ? ICONS.find(i => i.name === icon)?.Icon : null

  return (
    <>
      {createPortal(
        <div className="md-modal-overlay">
          <div className="md-modal-backdrop" onClick={onClose} />
          <div className="md-modal-window" style={{ backgroundColor: color }}>
            <div className="md-modal-header">
                
              <div className="md-modal-title-row">
                {SelectedIcon ? <SelectedIcon onClick={() => setIsOpenCastomize(!isOpenCastomize)} className="md-modal-icon" /> : <PiSelection onClick={() => setIsOpenCastomize(!isOpenCastomize)} className="md-modal-icon" />}
                <input className="md-modal-title-input" type="text" placeholder="Заголовок заметки" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              <div className="md-modal-header-actions md-modal-header-group">
                <div className="md-modal-header-group-tag" onClick={() => setIsOpenCastomize(true)} title="Изменить группу">
                  {activeGroup && (
                    <>
                      <HiOutlineFolder />
                      <span>{activeGroup.name}</span>
                      <button className="md-modal-header-group-clear" onClick={(e) => { e.stopPropagation(); setSelectedGroup(''); }} title="Убрать группу">×</button>
                    </>
                  )}
                </div>
                
                <div className="md-modal-block">
                  <button className={`md-modal-pin ${isPinned ? 'active' : ''}`} onClick={() => setIsPinned(!isPinned)} title={isPinned ? 'Открепить' : 'Закрепить'}>
                    {isPinned ? <TiPinOutline /> : <TiPin />}
                  </button>
                  <button className="md-modal-close" onClick={onClose}>×</button>
                </div>
              </div>
            </div>
            
            {isOpenCastomize && (
              <div className="md-modal-appearance">
                <div className="md-modal-colors">
                  {COLORS.map(c => (
                    <button key={c.name} className={`md-modal-color-btn ${color === c.value ? 'active' : ''}`} style={{ backgroundColor: c.value }} onClick={() => setColor(c.value)} title={c.name} />
                  ))}
                </div>
                <div className="md-modal-icons">
                  {ICONS.map(({ name, Icon }) => (
                    <button key={name} className={`md-modal-icon-btn ${icon === name ? 'active' : ''}`} onClick={() => setIcon(icon === name ? null : name)} title={name}><Icon /></button>
                  ))}
                </div>
                
                <div className="md-modal-groups-section">
                  <div className="md-modal-groups-tags">
                    <button className={`md-modal-group-tag ${selectedGroup === '' ? 'active' : ''}`} onClick={() => setSelectedGroup('')}>Без группы</button>
                    {groups.map(g => (
                      <button key={g.id} className={`md-modal-group-tag ${selectedGroup === String(g.id) ? 'active' : ''}`} onClick={() => setSelectedGroup(String(g.id))}>
                        <HiOutlineFolder />{g.name}
                      </button>
                    ))}
                    <button className="md-modal-group-tag md-modal-group-tag-add" onClick={() => setIsGroupModalOpen(true)}>
                      <HiOutlinePlus /> Новая группа
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="md-modal-meta">
              <div className="md-modal-dates">
                <label className="md-modal-date-label">
                  <input type="date" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} className="md-modal-date-input" />
                </label>
                
                <div className="md-modal-date-label md-modal-deadline-container">
                  {isDeadlineOpen ? (
                    <div className="md-modal-deadline-edit">
                      <input 
                        type="date" 
                        value={deadline} 
                        onChange={(e) => setDeadline(e.target.value)} 
                        className={`md-modal-date-input ${deadline ? 'has-deadline' : ''}`}
                        autoFocus
                      />
                      <button className="md-modal-date-toggle-btn" onClick={() => setIsDeadlineOpen(false)} title="Скрыть">×</button>
                    </div>
                  ) : (
                    <div 
                      className={`md-modal-deadline-view ${deadline ? 'has-deadline' : ''}`} 
                      onClick={() => setIsDeadlineOpen(true)}
                      title={deadline ? "Изменить дедлайн" : "Добавить дедлайн"}
                    >
                      {deadline ? (
                        <>
                          <span className="md-modal-deadline-text">{new Date(deadline).toLocaleDateString('ru-RU')}</span>
                          <button className="md-modal-date-clear-btn" onClick={(e) => { e.stopPropagation(); setDeadline(''); }} title="Удалить дедлайн">×</button>
                        </>
                      ) : (
                        <>
                          <IoAddOutline className="md-modal-deadline-icon" />
                          <span>Дедлайн</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="md-modal-textarea"
              placeholder="Введите текст..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

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

            {selectedTasks.length > 0 && (
              <div className="md-modal-section">
                <h4>Прикреплённые задачи ({completedTasks}/{totalTasks})</h4>
                <div className="md-modal-task-progress-bar-container">
                  <div className="md-modal-task-progress-bar-fill" style={{ width: `${taskProgressPercent}%` }}></div>
                </div>
                <div className="md-modal-selected-tasks">
                  {selectedTasks.map(taskId => {
                    const task = AVAILABLE_TASKS.find(t => t.id === taskId)
                    return (
                      <div 
                        key={taskId} 
                        className={`md-modal-task-tag ${task.done ? 'is-done' : ''} ${draggedTaskId === taskId ? 'dragging' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, taskId)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, taskId)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => handleTaskClick(e, taskId)}
                        title="Перетащите для изменения порядка или кликните для перехода"
                      >
                        {/* ИСПРАВЛЕНО: HiBars3 вместо HiOutlineMenu */}
                        <HiBars3 className="drag-handle" title="Перетащить" />
                        <GoShareAndroid />
                        <span>{task.text}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeTask(taskId); }}>×</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedUsers.length > 0 && (
              <div className="md-modal-section">
                <h4>Участники</h4>
                <div className="md-modal-selected-users">
                  {selectedUsers.map(userId => {
                    const user = AVAILABLE_USERS.find(u => u.id === userId)
                    return (
                      <div key={userId} className="md-modal-user-tag" onClick={() => navigate(`/users/${userId}`)} title="Перейти к профилю">
                        <FaRegUser />
                        <span>{user.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeUser(userId); }}>×</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedNotes.length > 0 && (
              <div className="md-modal-section">
                <h4>Связанные заметки</h4>
                <div className="md-modal-selected-notes">
                  {selectedNotes.map(noteId => {
                    const note = AVAILABLE_NOTES.find(n => n.id === noteId)
                    return (
                      <div key={noteId} className="md-modal-note-tag" onClick={() => navigate(`/notes/${noteId}`)} title="Открыть заметку">
                        <FaRegNoteSticky />
                        <span>{note.title}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeNote(noteId); }}>×</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="md-modal-toolbar">
                <div className="md-modal-block">
                  <div className="md-modal-picker" ref={userPickerRef}>
                    <button className="btn" type="button" onClick={() => setIsUserPickerOpen(!isUserPickerOpen)} title="Дать доступ"><FaRegUser /></button>
                    {isUserPickerOpen && (
                      <div className="md-modal-dropdown">
                        <h5>Выберите пользователей</h5>
                        {AVAILABLE_USERS.map(user => (
                          <label key={user.id} className="md-modal-dropdown-item">
                            <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleUser(user.id)} />
                            <span>{user.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="btn" type="button" onClick={() => setIsOpenLinkPanel(!isOpenLinkPanel)} title="Прикрепить ссылку"><LuLink /></button>

                  <div className="md-modal-picker" ref={notePickerRef}>
                    <button className="btn" type="button" onClick={() => setIsNotePickerOpen(!isNotePickerOpen)} title="Прикрепить заметку"><FaRegNoteSticky /></button>
                    {isNotePickerOpen && (
                      <div className="md-modal-dropdown">
                        <h5>Связать с заметками</h5>
                        {AVAILABLE_NOTES.map(note => (
                          <label key={note.id} className="md-modal-dropdown-item">
                            <input type="checkbox" checked={selectedNotes.includes(note.id)} onChange={() => toggleNote(note.id)} />
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
                    <button className="btn" type="button" onClick={() => setIsTaskPickerOpen(!isTaskPickerOpen)} title="Прикрепить задачу"><GoShareAndroid /></button>
                    {isTaskPickerOpen && (
                      <div className="md-modal-dropdown">
                        <h5>Прикрепить задачи</h5>
                        {AVAILABLE_TASKS.map(task => (
                          <label key={task.id} className="md-modal-dropdown-item">
                            <input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => toggleTask(task.id)} />
                            <span>{task.text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="btn" type="button" onClick={() => insertMarkdown('[', '](url)')} title="Поделиться"><RiShareBoxLine /></button>
                </div>
              <div className="md-modal-block">
                <button className="md-btn md-btn-secondary" onClick={onClose}>Отмена</button>
                <button className="md-btn md-btn-primary" onClick={handleSave}>Сохранить</button>
              </div>
            </div>

            {isOpenLinkPanel && (
              <div className="md-modal-link-input-row">
                <input ref={linkInputRef} type="url" placeholder="Добавить ссылку" value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLink()} />
                <button onClick={addLink}><IoAddOutline /></button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* --- МОДАЛКА СОЗДАНИЯ ГРУППЫ --- */}
      {isGroupModalOpen && createPortal(
        <div className="md-modal-overlay">
          <div className="md-modal-backdrop" onClick={() => setIsGroupModalOpen(false)} />
          <div className="md-modal-window md-modal-window-sm">
            <div className="md-modal-header">
              <h3>Создать новую группу</h3>
              <button className="md-modal-close" onClick={() => setIsGroupModalOpen(false)}>×</button>
            </div>

            <div className="md-modal-section">
              <label className="md-modal-form-label">Название группы *</label>
              <input type="text" className="md-modal-form-input" placeholder="Например: Маркетинг" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
            </div>

            <div className="md-modal-section">
              <label className="md-modal-form-label">Описание</label>
              <textarea className="md-modal-form-textarea" placeholder="Краткое описание цели группы..." value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} rows={3} />
            </div>

            <div className="md-modal-section">
              <label className="md-modal-form-label">Участники группы</label>
              <div className="md-modal-group-checkboxes">
                {AVAILABLE_USERS.map(user => (
                  <label key={user.id} className="md-modal-dropdown-item">
                    <input type="checkbox" checked={newGroupUsers.includes(user.id)} onChange={() => setNewGroupUsers(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])} />
                    <span>{user.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md-modal-section">
              <label className="md-modal-form-label">Связанные заметки</label>
              <div className="md-modal-group-checkboxes">
                {AVAILABLE_NOTES.map(note => (
                  <label key={note.id} className="md-modal-dropdown-item">
                    <input type="checkbox" checked={newGroupNotes.includes(note.id)} onChange={() => setNewGroupNotes(prev => prev.includes(note.id) ? prev.filter(id => id !== note.id) : [...prev, note.id])} />
                    <span>{note.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md-modal-footer">
              <button className="md-btn md-btn-secondary" onClick={() => setIsGroupModalOpen(false)}>Отмена</button>
              <button className="md-btn md-btn-primary" onClick={handleCreateGroup} disabled={!newGroupName.trim()}>Создать группу</button>
            </div> 
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
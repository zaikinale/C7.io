import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import './Modal.css'

import { PiSelection } from "react-icons/pi"
import { TiPin, TiPinOutline } from "react-icons/ti"
import { HiOutlineFolder, HiOutlinePlus } from "react-icons/hi2"
import { FaRegUser, FaRegNoteSticky } from "react-icons/fa6"
import { GoShareAndroid } from "react-icons/go"
import { LuLink } from "react-icons/lu"
import { RiShareBoxLine } from "react-icons/ri"
import { IoAddOutline } from "react-icons/io5"

import { COLORS, ICONS, INITIAL_GROUPS, AVAILABLE_USERS, AVAILABLE_NOTES, AVAILABLE_TASKS } from '../../data/mockData'
import GroupCreationModal from './GroupCreationModal'
import AttachedTasks from './AttachedTasks'
import AttachedSimpleList from './AttachedSimpleList'
import ModalToolbar from './ModalToolbar'

// ✅ 1. ДОБАВЛЯЕМ initialData В ПРОПСЫ
export default function MarkdownNoteModal({ isOpen, onClose, onSave, initialData = null }) {
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
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().split('T')[0])
  const [deadline, setDeadline] = useState('')
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false)
  const [isOpenLinkPanel, setIsOpenLinkPanel] = useState(false)
  
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [selectedGroup, setSelectedGroup] = useState('')
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

  const textareaRef = useRef(null)
  const linkInputRef = useRef(null)

  const activeGroup = groups.find(g => String(g.id) === selectedGroup)

  // ✅ 2. ЭФФЕКТ ДЛЯ ЗАПОЛНЕНИЯ ИЛИ СБРОСА ФОРМЫ
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '')
        setContent(initialData.content || '')
        setLinks(initialData.links || [])
        setSelectedTasks(initialData.tasks || [])
        setSelectedUsers(initialData.users || [])
        setSelectedNotes(initialData.notes || [])
        setIsPinned(initialData.isPinned || false)
        setColor(initialData.color || COLORS[0].value)
        setIcon(initialData.icon || null)
        setCreatedAt(initialData.createdAt ? initialData.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])
        setDeadline(initialData.deadline || '')
        setSelectedGroup(initialData.group || '')
      } else {
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
        setSelectedGroup('')
      }
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (isOpen && textareaRef.current) textareaRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { 
      if (e.key === 'Escape') {
        if (isGroupModalOpen) setIsGroupModalOpen(false)
        else if (isDeadlineOpen) setIsDeadlineOpen(false)
        else if (isOpenLinkPanel) setIsOpenLinkPanel(false)
        else onClose()
      }
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose, isGroupModalOpen, isDeadlineOpen, isOpenLinkPanel])

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

  const toggleItem = (setter) => (id) => setter(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const removeItem = (setter) => (id) => setter(prev => prev.filter(i => i !== id))

  const handleTaskReorder = (dragId, dropId) => {
    setSelectedTasks(prev => {
      const newTasks = [...prev]
      const dragIdx = newTasks.indexOf(dragId)
      const dropIdx = newTasks.indexOf(dropId)
      const [removed] = newTasks.splice(dragIdx, 1)
      newTasks.splice(dropIdx, 0, removed)
      return newTasks
    })
  }

  const handleCreateGroup = (groupData) => {
    const newGroup = { id: Date.now(), ...groupData }
    setGroups([...groups, newGroup])
    setSelectedGroup(String(newGroup.id))
    setIsGroupModalOpen(false)
  }

  const handleSave = () => {
    if (content.trim() || title.trim()) {
      onSave({
        title: title.trim(), content: content.trim(), links,
        tasks: selectedTasks, users: selectedUsers, notes: selectedNotes,
        isPinned, color, icon, createdAt,
        deadline: deadline || null, group: selectedGroup || null,
      })
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
                      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={`md-modal-date-input ${deadline ? 'has-deadline' : ''}`} autoFocus />
                      <button className="md-modal-date-toggle-btn" onClick={() => setIsDeadlineOpen(false)} title="Скрыть">×</button>
                    </div>
                  ) : (
                    <div className={`md-modal-deadline-view ${deadline ? 'has-deadline' : ''}`} onClick={() => setIsDeadlineOpen(true)} title={deadline ? "Изменить дедлайн" : "Добавить дедлайн"}>
                      {deadline ? (
                        <><span className="md-modal-deadline-text">{new Date(deadline).toLocaleDateString('ru-RU')}</span>
                        <button className="md-modal-date-clear-btn" onClick={(e) => { e.stopPropagation(); setDeadline(''); }} title="Удалить дедлайн">×</button></>
                      ) : (
                        <><span>Дедлайн</span></>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <textarea ref={textareaRef} className="md-modal-textarea" placeholder="Введите текст..." value={content} onChange={(e) => setContent(e.target.value)} />

            {links.length > 0 && (
              <div className="md-modal-section">
                <h4>Прикреплённые ссылки</h4>
                <div className="md-modal-links">
                  {links.map((link, idx) => (
                    <div key={idx} className="md-modal-link-item">
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      <button onClick={() => removeItem(setLinks)(link)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AttachedTasks tasks={selectedTasks} onRemove={removeItem(setSelectedTasks)} onNavigate={(id) => navigate(`/tasks/${id}`)} onReorder={handleTaskReorder} />
            
            <AttachedSimpleList 
              title="Участники" items={selectedUsers} icon={FaRegUser}
              onRemove={removeItem(setSelectedUsers)} onNavigate={(id) => navigate(`/users/${id}`)}
              renderLabel={(id) => { const u = AVAILABLE_USERS.find(x => x.id === id); return u?.name; }}
            />
            
            <AttachedSimpleList 
              title="Связанные заметки" items={selectedNotes} icon={FaRegNoteSticky}
              onRemove={removeItem(setSelectedNotes)} onNavigate={(id) => navigate(`/notes/${id}`)}
              renderLabel={(id) => { const n = AVAILABLE_NOTES.find(x => x.id === id); return n?.title; }}
            />

            <ModalToolbar 
              onToggleUser={toggleItem(setSelectedUsers)}
              onToggleNote={toggleItem(setSelectedNotes)}
              onToggleTask={toggleItem(setSelectedTasks)}
              selectedUsers={selectedUsers} selectedNotes={selectedNotes} selectedTasks={selectedTasks}
              isOpenLinkPanel={isOpenLinkPanel}
              onToggleLinkPanel={() => setIsOpenLinkPanel(prev => !prev)}
              newLink={newLink} setNewLink={setNewLink} onAddLink={addLink} linkInputRef={linkInputRef}
              onInsertMarkdown={insertMarkdown} onClose={onClose} onSave={handleSave}
            />
          </div>
        </div>,
        document.body
      )}

      <GroupCreationModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} onCreate={handleCreateGroup} />
    </>
  )
}
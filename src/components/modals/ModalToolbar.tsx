import { useState, useRef, useEffect } from 'react'
import { LuLink } from "react-icons/lu"
import { FaRegNoteSticky, FaRegUser } from "react-icons/fa6"
import { GoShareAndroid } from "react-icons/go"
import { RiShareBoxLine } from "react-icons/ri"
import { IoAddOutline } from "react-icons/io5"
import { AVAILABLE_USERS, AVAILABLE_NOTES, AVAILABLE_TASKS } from '../../data/mockData'

export default function ModalToolbar({ 
  onToggleUser, onToggleNote, onToggleTask, 
  selectedUsers, selectedNotes, selectedTasks,
  isOpenLinkPanel, onToggleLinkPanel, // ✅ Получаем состояние и переключатель
  newLink, setNewLink, onAddLink, linkInputRef,
  onInsertMarkdown, onClose, onSave 
}) {
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [isTaskOpen, setIsTaskOpen] = useState(false)

  const userRef = useRef(null)
  const noteRef = useRef(null)
  const taskRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false)
      if (noteRef.current && !noteRef.current.contains(e.target)) setIsNoteOpen(false)
      if (taskRef.current && !taskRef.current.contains(e.target)) setIsTaskOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="md-modal-toolbar">
      <div className="md-modal-block">
        <div className="md-modal-picker" ref={userRef}>
          <button className="btn" type="button" onClick={() => setIsUserOpen(!isUserOpen)} title="Дать доступ"><FaRegUser /></button>
          {isUserOpen && (
            <div className="md-modal-dropdown">
              <h5>Выберите пользователей</h5>
              {AVAILABLE_USERS.map(user => (
                <label key={user.id} className="md-modal-dropdown-item">
                  <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => onToggleUser(user.id)} />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Теперь кнопка просто переключает состояние панели ссылок */}
        <button className="btn" type="button" onClick={onToggleLinkPanel} title="Прикрепить ссылку">
          <LuLink />
        </button>

        <div className="md-modal-picker" ref={noteRef}>
          <button className="btn" type="button" onClick={() => setIsNoteOpen(!isNoteOpen)} title="Прикрепить заметку"><FaRegNoteSticky /></button>
          {isNoteOpen && (
            <div className="md-modal-dropdown">
              <h5>Связать с заметками</h5>
              {AVAILABLE_NOTES.map(note => (
                <label key={note.id} className="md-modal-dropdown-item">
                  <input type="checkbox" checked={selectedNotes.includes(note.id)} onChange={() => onToggleNote(note.id)} />
                  <div className="md-modal-dropdown-note-info">
                    <span className="md-modal-dropdown-note-title">{note.title}</span>
                    <span className="md-modal-dropdown-note-text">{note.text}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="md-modal-picker" ref={taskRef}>
          <button className="btn" type="button" onClick={() => setIsTaskOpen(!isTaskOpen)} title="Прикрепить задачу"><GoShareAndroid /></button>
          {isTaskOpen && (
            <div className="md-modal-dropdown">
              <h5>Прикрепить задачи</h5>
              {AVAILABLE_TASKS.map(task => (
                <label key={task.id} className="md-modal-dropdown-item">
                  <input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => onToggleTask(task.id)} />
                  <span>{task.text}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="btn" type="button" onClick={() => onInsertMarkdown('[', '](url)')} title="Поделиться"><RiShareBoxLine /></button>
      </div>

      {/* ✅ Панель рендерится только если isOpenLinkPanel === true */}
      {isOpenLinkPanel && (
        <div className="md-modal-link-input-row">
          <input 
            ref={linkInputRef} 
            type="url" 
            placeholder="Добавить ссылку" 
            value={newLink} 
            onChange={(e) => setNewLink(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && onAddLink()} 
            autoFocus
          />
          <button onClick={onAddLink}><IoAddOutline /></button>
        </div>
      )}

      <div className="md-modal-block">
        <button className="md-btn md-btn-secondary" onClick={onClose}>Отмена</button>
        <button className="md-btn md-btn-primary" onClick={onSave}>Сохранить</button>
      </div>
    </div>
  )
}
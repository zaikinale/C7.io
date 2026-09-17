import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AVAILABLE_USERS, AVAILABLE_NOTES } from '../../data/mockData'

export default function GroupCreationModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [users, setUsers] = useState([])
  const [notes, setNotes] = useState([])
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (isOpen && nameInputRef.current) nameInputRef.current.focus()
  }, [isOpen])

  const handleSubmit = () => {
    if (!name.trim()) return
    onCreate({ name: name.trim(), description: desc.trim(), users, notes })
    setName('')
    setDesc('')
    setUsers([])
    setNotes([])
  }

  if (!isOpen) return null

  return createPortal(
    <div className="md-modal-overlay">
      <div className="md-modal-backdrop" onClick={onClose} />
      <div className="md-modal-window md-modal-window-sm">
        <div className="md-modal-header">
          <h3>Создать новую группу</h3>
          <button className="md-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="md-modal-section">
          <label className="md-modal-form-label">Название группы *</label>
          <input ref={nameInputRef} type="text" className="md-modal-form-input" placeholder="Например: Маркетинг" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="md-modal-section">
          <label className="md-modal-form-label">Описание</label>
          <textarea className="md-modal-form-textarea" placeholder="Краткое описание цели группы..." value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
        </div>

        <div className="md-modal-section">
          <label className="md-modal-form-label">Участники группы</label>
          <div className="md-modal-group-checkboxes">
            {AVAILABLE_USERS.map(user => (
              <label key={user.id} className="md-modal-dropdown-item">
                <input type="checkbox" checked={users.includes(user.id)} onChange={() => setUsers(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])} />
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
                <input type="checkbox" checked={notes.includes(note.id)} onChange={() => setNotes(prev => prev.includes(note.id) ? prev.filter(id => id !== note.id) : [...prev, note.id])} />
                <span>{note.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md-modal-footer">
          <button className="md-btn md-btn-secondary" onClick={onClose}>Отмена</button>
          <button className="md-btn md-btn-primary" onClick={handleSubmit} disabled={!name.trim()}>Создать группу</button>
        </div> 
      </div>
    </div>,
    document.body
  )
}
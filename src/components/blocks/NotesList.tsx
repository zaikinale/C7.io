import { useState } from "react"
import { IoAdd } from "react-icons/io5"
import MarkdownNoteModal from "../modals/MarkdownNoteModal"

export default function NotesList() {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Не забыть обновить зависимости проекта' },
    { id: 2, text: 'Идея: добавить тёмную/светлую тему' },
  ])
  const [editing, setEditing] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const remove = (id) => setNotes((ns) => ns.filter((n) => n.id !== id))
  
  const saveInline = (id, text) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, text } : n)))
    setEditing(null)
  }

  const handleSaveNewNote = (newText) => {
    setNotes((ns) => [{ id: Date.now(), text: newText }, ...ns])
  }

  return (
    <>
      <div className="notes-list">
        <div className="block-head jcsb aic">
          <h2 className="block-title">
            Заметки <span className="badge">{notes.length}</span>
          </h2>
          <button className="btn-add" onClick={() => setIsModalOpen(true)} title="Создать заметку">
            <IoAdd />
          </button>
        </div>

        <div className="notes-grid">
          {notes.map((n) => (
            <div key={n.id} className="note-card">
              {editing === n.id ? (
                <textarea
                  className="note-edit"
                  defaultValue={n.text}
                  autoFocus
                  onBlur={(e) => saveInline(n.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      saveInline(n.id, e.target.value)
                    }
                  }}
                />
              ) : (
                <p className="note-text" onClick={() => setEditing(n.id)}>
                  {n.text}
                </p>
              )}
              <button className="note-del" onClick={() => remove(n.id)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка рендерится через портал в document.body */}
      <MarkdownNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewNote}
      />
    </>
  )
}
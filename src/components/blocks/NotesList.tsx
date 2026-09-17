import { useState, useMemo } from "react"
import { IoAdd } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { TiPinOutline } from "react-icons/ti"
import MarkdownNoteModal from "../modals/MarkdownNoteModal"

// Хелпер для проверки, является ли дедлайн сегодняшним днем
const isDeadlineToday = (deadlineStr) => {
  if (!deadlineStr) return false
  const today = new Date().toISOString().split('T')[0]
  return deadlineStr.startsWith(today)
}

export default function NotesList() {
  const navigate = useNavigate()

  // Используем богатую структуру данных, совместимую с MarkdownNoteModal
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: 'Обновление зависимостей', 
      content: 'Не забыть обновить зависимости проекта и проверить сборку.',
      deadline: new Date().toISOString().split('T')[0], // Дедлайн сегодня!
      isPinned: true,
      color: 'rgba(255, 255, 255, 0.04)',
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      title: 'Темная тема', 
      content: 'Идея: добавить переключатель тёмной/светлой темы в настройки.',
      deadline: '',
      isPinned: false,
      color: 'rgba(255, 255, 255, 0.04)',
      createdAt: new Date(Date.now() - 86400000).toISOString() // Вчера
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  // Сортировка: сначала закрепленные, потом по дате создания (новые сверху)
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return a.isPinned ? -1 : 1
    })
  }, [notes])

  // Показываем только топ-4, чтобы блок на дашборде не был слишком длинным
  const displayNotes = sortedNotes.slice(0, 4)

  const remove = (id, e) => {
    e.stopPropagation() // Чтобы не открывалась модалка при удалении
    setNotes((ns) => ns.filter((n) => n.id !== id))
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      // Обновление существующей
      setNotes((ns) => ns.map((n) => (n.id === editingNote.id ? { ...noteData, id: editingNote.id } : n)))
    } else {
      // Создание новой
      setNotes((ns) => [{ ...noteData, id: Date.now() }, ...ns])
    }
    setEditingNote(null)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="notes-list">
        <div className="block-head jcsb aic">
          <h2 className="block-title" onClick={() => navigate('/notes')}>
            Заметки <span className="badge">{notes.length}</span>
          </h2>
          <button 
            className="btn-add" 
            onClick={() => { setEditingNote(null); setIsModalOpen(true) }} 
            title="Создать заметку"
          >
            <IoAdd />
          </button>
        </div>

        <div className="notes-grid">
          {displayNotes.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.85rem', padding: '10px 0' }}>Нет заметок</p>
          ) : (
            displayNotes.map((n) => {
              const deadlineToday = isDeadlineToday(n.deadline)
              return (
                <div 
                  key={n.id} 
                  className="note-card dashboard-note-card" 
                  onClick={() => handleEdit(n)}
                  style={{ backgroundColor: n.color || 'rgba(255,255,255,0.04)' }}
                >
                  <div className="note-card-header">
                    <span className="note-title" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {n.isPinned && <TiPinOutline className="pinned-icon" />}
                      {n.title || 'Без названия'}
                    </span>
                  </div>
                  
                  <p className="note-text" style={{ fontSize: '0.8rem', marginTop: '4px', lineHeight: '1.4' }}>
                    {n.content.substring(0, 70)}{n.content.length > 70 ? '...' : ''}
                  </p>
                  
                  <div className="note-card-footer" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(n.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    {deadlineToday && (
                      <span className="deadline-today-badge">Сегодня</span>
                    )}
                  </div>

                  <button className="note-del" onClick={(e) => remove(n.id, e)} title="Удалить">×</button>
                </div>
              )
            })
          )}
        </div>
      </div>

      <MarkdownNoteModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingNote(null); }}
        onSave={handleSaveNote}
        initialData={editingNote}
      />
    </>
  )
}
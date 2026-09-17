import { useState, useEffect } from 'react'
import '../../styles/Page.css' // Подключаем обновленные стили Ниже
import MarkdownNoteModal from '../../components/modals/MarkdownNoteModal'

import { IoAddOutline, IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5"
import { TiPin, TiPinOutline } from "react-icons/ti"
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2"
import { FaRegNoteSticky, FaRegFolderOpen } from "react-icons/fa6"
import { BsGrid1X2, BsGrid3X3Gap } from "react-icons/bs"

const INITIAL_NOTES = [
  {
    id: 1, 
    title: 'GLYPH OS CONCEPT', 
    content: 'Использовать светодиодные полосы для отображения прогресса выполнения задач.',
    group: '1', 
    size: 'size-2x1', // Размер для Bento Grid
    isPinned: true, 
    color: '#121212', 
    icon: 'star',
    createdAt: '2023-10-25', 
    deadline: '', 
    links: [], tasks: [], users: [], notes: []
  },
  {
    id: 2, 
    title: 'СПИСОК ПОКУПОК', 
    content: '- Монитор 27"\n- Кабель Type-C\n- Механическая клавиатура',
    group: '2', 
    size: 'size-1x1', 
    isPinned: false, 
    color: '#121212', 
    icon: 'heart',
    createdAt: '2023-10-26', 
    deadline: '2023-11-01', 
    links: [], tasks: [], users: [], notes: []
  },
  {
    id: 3, 
    title: 'ПЛАН РАЗРАБОТКИ', 
    content: 'Переписать карточки под асимметричную сетку Bento. Добавить фильтрацию по тапу.',
    group: '3', 
    size: 'size-2x2', 
    isPinned: false, 
    color: '#121212', 
    icon: 'note',
    createdAt: '2023-10-28', 
    deadline: '', 
    links: [], tasks: [], users: [], notes: []
  }
]

const FOLDERS = [
  { id: 'all', name: 'Все' },
  { id: '1', name: 'Работа' },
  { id: '2', name: 'Личное' },
  { id: '3', name: 'Учёба' },
]

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('my_app_notes')
    return saved ? JSON.parse(saved) : INITIAL_NOTES
  })
  
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [compactView, setCompactView] = useState(false) // Переключение вида

  useEffect(() => {
    localStorage.setItem('my_app_notes', JSON.stringify(notes))
  }, [notes])

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...noteData, id: editingNote.id } : n))
    } else {
      setNotes(prev => [{ 
        ...noteData, 
        id: Date.now(), 
        size: noteData.size || 'size-1x1',
        createdAt: new Date().toISOString() 
      }, ...prev])
    }
    setEditingNote(null)
    setIsModalOpen(false)
  }

  const handleEdit = (note, e) => {
    if (e) e.stopPropagation()
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation()
    if (window.confirm('Удалить эту заметку?')) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
  }

  const handlePin = (id, e) => {
    if (e) e.stopPropagation()
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n))
  }

  const handleCreateNew = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  // Фильтрация
  const filteredNotes = notes.filter(note => {
    const matchesFolder = selectedFolder === 'all' || note.group === selectedFolder
    const matchesSearch = (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (note.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const pinnedNotes = filteredNotes.filter(n => n.isPinned)
  const otherNotes = filteredNotes.filter(n => !n.isPinned)

  const getFolderName = (groupId) => {
    const folder = FOLDERS.find(f => f.id === groupId)
    return folder ? folder.name : null
  }

  // Отрисовка BENTO-карточки
  const renderCard = (note) => (
    <div 
      key={note.id} 
      className={`note-card-block ${note.size || 'size-1x1'} ${note.isPinned ? 'pinned-card' : ''}`}
      onClick={() => handleEdit(note)}
    >
      <div className="note-card-top jcsb aic">
        <span className="card-tag">#{getFolderName(note.group) || 'NOTE'}</span>
        <div className="note-card-actions">
          <button 
            className={`note-act-btn ${note.isPinned ? 'pinned' : ''}`} 
            onClick={(e) => handlePin(note.id, e)} 
            title={note.isPinned ? 'Открепить' : 'Закрепить'}
          >
            {note.isPinned ? <TiPin color="#ff0000" /> : <TiPinOutline />}
          </button>
          <button className="note-act-btn" onClick={(e) => handleEdit(note, e)} title="Редактировать">
            <HiOutlinePencil />
          </button>
          <button className="note-act-btn danger" onClick={(e) => handleDelete(note.id, e)} title="Удалить">
            <HiOutlineTrash />
          </button>
        </div>
      </div>
      
      <div className="note-card-body">
        {note.title && <h3 className="note-card-title">{note.title}</h3>}
        {note.content && (
          <p className="note-card-content">
            {note.content.length > 120 ? `${note.content.substring(0, 120)}...` : note.content}
          </p>
        )}
      </div>

      <div className="note-card-bottom jcsb aic">
        <span className="note-date">
          {note.createdAt ? new Date(note.createdAt).toLocaleDateString('ru-RU') : ''}
        </span>
        <span className="bento-size-indicator">// {note.size ? note.size.replace('size-', '') : '1x1'}</span>
      </div>
    </div>
  )

  return (
    <div className="notes-page-wrapper">
      {/* ═══════ HEADER IN NOTHING OS STYLE ═══════ */}
      <header className="section jcsb aic nothing-header-block">
        <div className="brand-title aic">
          <span className="glyph-pulse"></span>
          <h1 className="ndot-title">NOTHING (NOTES)</h1>
        </div>
        
        <div className="header-controls aic">
          {/* Переключатель вида (ПК) */}
          <button 
            className="view-toggle-btn desktop-only" 
            onClick={() => setCompactView(!compactView)}
            title="Сменить режим сетки"
          >
            {compactView ? <BsGrid3X3Gap /> : <BsGrid1X2 />}
          </button>

          <button className="btn-primary-add" onClick={handleCreateNew}>
            <IoAddOutline size={18} /> <span className="desktop-only">Новая заметка</span>
          </button>
        </div>
      </header>

      {/* ═══════ SEARCH & FILTERS ═══════ */}
      <main className="section">
        <div className="block jcsb aic nothing-filter-block" style={{ width: '100%', gap: '12px' }}>
          {/* Поиск */}
          <div className="notes-search-wrapper">
            <IoSearchOutline className="search-icon" />
            <input 
              type="text" 
              placeholder="ПОИСК..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="task-input ndot-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <IoCloseCircleOutline />
              </button>
            )}
          </div>

          {/* Фильтры папок */}
          <div className="notes-filter-pills">
            {FOLDERS.map(folder => (
              <button
                key={folder.id}
                className={`filter-pill ${selectedFolder === folder.id ? 'active' : ''}`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.name.toUpperCase()}
                <span className="filter-count">
                  {folder.id === 'all' 
                    ? notes.length 
                    : notes.filter(n => n.group === folder.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ═══════ BENTO GRID NOTES LISTS ═══════ */}
      {filteredNotes.length === 0 ? (
        <aside className="section block">
          <div className="notes-empty-state">
            <FaRegNoteSticky size={32} />
            <p>{searchQuery ? 'НИЧЕГО НЕ НАЙДЕНО' : 'ЗАМЕТОК ПОКА НЕТ'}</p>
          </div>
        </aside>
      ) : (
        <div className="notes-content-container">
          {/* Блок закрепленных заметок */}
          {pinnedNotes.length > 0 && (
            <aside className="section block">
              <div className="block-head">
                <div className="block-title">
                  <span className="red-dot"></span>
                  <span>ЗАКРЕПЛЕННЫЕ</span>
                  <span className="badge">{pinnedNotes.length}</span>
                </div>
              </div>
              <div className={`notes-bento-grid ${compactView ? 'compact' : ''}`}>
                {pinnedNotes.map(renderCard)}
              </div>
            </aside>
          )}

          {/* Блок основных заметок */}
          {otherNotes.length > 0 && (
            <aside className="section block">
              <div className="block-head">
                <div className="block-title">
                  <span>ВСЕ ЗАМЕТКИ</span>
                  <span className="badge">{otherNotes.length}</span>
                </div>
              </div>
              <div className={`notes-bento-grid ${compactView ? 'compact' : ''}`}>
                {otherNotes.map(renderCard)}
              </div>
            </aside>
          )}
        </div>
      )}

      {/* ═══════ MOBILE BOTTOM QUICK ACCESS BAR ═══════ */}
      <div className="mobile-bottom-bar">
        <button className="mob-btn" onClick={handleCreateNew}>
          <IoAddOutline size={22} />
          <span>Создать</span>
        </button>
        <button 
          className={`mob-btn ${selectedFolder === 'all' ? 'active' : ''}`} 
          onClick={() => setSelectedFolder('all')}
        >
          <FaRegFolderOpen size={18} />
          <span>Все</span>
        </button>
      </div>

      {/* ═══════ MODAL ═══════ */}
      <MarkdownNoteModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingNote(null); }}
        onSave={handleSaveNote}
        initialData={editingNote} 
      />
    </div>
  )
}
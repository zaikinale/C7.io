import { useState, useEffect, useCallback } from 'react'
import '../../styles/Page.css'

/* ───────── sub-components ───────── */

import Clock from '../../components/blocks/Clock'
import MiniCalendar from '../../components/blocks/MiniCalendar'
import TaskList from '../../components/blocks/TaskList'
import NotesList from '../../components/blocks/NotesList'
import AnalyticsSummary from '../../components/blocks/AnalyticsSummary'
import MarkdownNoteModal from '../../components/modals/MarkdownNoteModal'

/* ───────── helpers ───────── */
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1          // Пн = 0
}

/* ───────── main ───────── */
export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Функция сохранения (здесь нужно интегрировать с вашим NotesList)
  const handleSaveNote = (newNoteContent) => {
    console.log('Сохранена заметка:', newNoteContent)
    // TODO: Вызовите функцию добавления заметки из NotesList или поднимите состояние сюда
    // Например: addNote({ id: Date.now(), text: newNoteContent })
  }

  return (
    <>
      <header className="section">
        <h1>Dashboard</h1>
        {/* Кнопка для вызова модального окна (можно перенести в NotesList) */}
        {/* <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Новая заметка
        </button> */}
      </header>

      <main className="section">
        <aside className="time-data block-op">
          <Clock />
        </aside>
        <aside className="calendar-link block">
          <MiniCalendar />
        </aside>
      </main>

      <aside className="section block">
        <TaskList />
      </aside>

      {/* Передаём функцию открытия модалки в NotesList, если кнопка должна быть там */}
      <aside className="section block">
        <NotesList onOpenModal={() => setIsModalOpen(true)} />
      </aside>

      <aside className="section block">
        <AnalyticsSummary />
      </aside>

      <MarkdownNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveNote} 
      />
    </>
  )
}
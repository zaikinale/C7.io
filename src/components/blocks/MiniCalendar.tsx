import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

export default function MiniCalendar() {
    const navigate = useNavigate()
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth]  = useState(today.getMonth())

  const prev = () => { setMonth(m => m === 0 ? 11 : m - 1); if (month === 0) setYear(y => y - 1) }
  const next = () => { setMonth(m => m === 11 ? 0 : m + 1); if (month === 11) setYear(y => y + 1) }

  const daysInMonth  = getDaysInMonth(year, month)
  const firstDay     = getFirstDayOfWeek(year, month)
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(<span key={`e${i}`} className="cal-empty" />)
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    cells.push(
      <span key={d} onClick={() => navigate(`/calendar/${year}/${month}/${d}`)} className={`cal-day${isToday ? ' cal-today' : ''}`}>{d}</span>
    )
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-btn" onClick={prev}>‹</button>
        <span className="cal-title" onClick={() => navigate(`/calendar/${year}/${month}`)} >{MONTHS[month]} {year}</span>
        <button className="cal-btn" onClick={next}>›</button>
      </div>
      <div className="cal-grid-head">
        {DAYS.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Link, useNavigate} from "react-router-dom"

const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
]

export default function Clock() {
  const navigate = useNavigate()
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const date = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  const weekday = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'][now.getDay()]

    return (
        <div className="clock block-op">
            <span className="clock-time">{time}</span>
            <span className="clock-date">{weekday}, {date}</span>
            {/* <span className="clock-date">Мероприятие сейчас и до скольки?</span> */}
            <div className="subblock" onClick={() => navigate('/calendar/meet/1')}>
                <h3 className="title">Встреча с Сашей</h3>
                <span className="clock-date">До 19:00</span>
            </div>
            <span className="clock-date">Следующее: <Link to='/calendar/meet/2'>Поездка домой</Link> </span>

        </div>
    )
}
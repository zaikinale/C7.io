import { useState } from "react"

import { IoAdd } from "react-icons/io5";

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Сделать макет дашборда', done: true },
    { id: 2, text: 'Написать API-запросы',   done: false },
    { id: 3, text: 'Code review PR #42',     done: false },
  ])
  const [input, setInput] = useState('')

  const toggle = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = id => setTasks(ts => ts.filter(t => t.id !== id))
  const add = () => {
    const text = input.trim()
    if (!text) return
    setTasks(ts => [...ts, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const doneCount = tasks.filter(t => t.done).length

  return (
    <div className="task-list">
      <div className="block-head">
        <h2 className="block-title">
          Задачи <span className="badge">{doneCount}/{tasks.length}</span>
        </h2>
        <button className="btn-add">
          <IoAdd />
        </button>
      </div>
      

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: tasks.length ? `${(doneCount / tasks.length) * 100}%` : '0%' }}
        />
      </div>

      <ul className="tasks">
        {tasks.map(t => (
          <li key={t.id} className={`task-item${t.done ? ' task-done' : ''}`}>
            <label className="task-check">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span className="checkmark" />
            </label>
            <span className="task-text">{t.text}</span>
            <button className="task-del" onClick={() => remove(t.id)}>×</button>
          </li>
        ))}
      </ul>

      {/* <div className="task-add">
        <input
          className="task-input"
          placeholder="Новая задача…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="task-add-btn" onClick={add}>+</button>
      </div> */}
    </div>
  )
}
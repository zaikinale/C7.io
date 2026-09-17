import { useState, useRef } from 'react'
import { GoShareAndroid } from "react-icons/go"
import { HiBars3 } from "react-icons/hi2"
import { AVAILABLE_TASKS } from '../../data/mockData'

export default function AttachedTasks({ tasks, onRemove, onNavigate, onReorder }) {
  // 🚀 Если задач нет, вообще не рендерим этот блок
  if (!tasks || tasks.length === 0) {
    return null
  }

  const isDraggingRef = useRef(false)
  const [draggedId, setDraggedId] = useState(null)

  const handleDragStart = (e, taskId) => {
    isDraggingRef.current = true
    setDraggedId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    onReorder(draggedId, targetId)
    setDraggedId(null)
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
    setDraggedId(null)
  }

  const handleClick = (e, taskId) => {
    if (isDraggingRef.current) {
      e.preventDefault()
      return
    }
    onNavigate(taskId)
  }

  const total = tasks.length
  const completed = tasks.filter(id => AVAILABLE_TASKS.find(t => t.id === id)?.done).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="md-modal-section">
      <h4>Прикреплённые задачи ({completed}/{total})</h4>
      <div className="md-modal-task-progress-bar-container">
        <div className="md-modal-task-progress-bar-fill" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="md-modal-selected-tasks">
        {tasks.map(taskId => {
          const task = AVAILABLE_TASKS.find(t => t.id === taskId)
          if (!task) return null
          return (
            <div 
              key={taskId} 
              className={`md-modal-task-tag ${task.done ? 'is-done' : ''} ${draggedId === taskId ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, taskId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, taskId)}
              onDragEnd={handleDragEnd}
              onClick={(e) => handleClick(e, taskId)}
              title="Перетащите для изменения порядка или кликните для перехода"
            >
              <HiBars3 className="drag-handle" title="Перетащить" />
              <GoShareAndroid />
              <span>{task.text}</span>
              <button onClick={(e) => { e.stopPropagation(); onRemove(taskId); }}>×</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
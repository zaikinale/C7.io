
export default function AnalyticsSummary() {
  const stats = [
    { label: 'Задачи завершены',  value: 73, color: '#6ee7b7' },
    { label: 'Активность за неделю', value: 58, color: '#7dd3fc' },
    { label: 'Заметки созданы',   value: 41, color: '#c4b5fd' },
    { label: 'Дедлайны в срок',   value: 89, color: '#fca5a5' },
  ]

  return (
    <div className="analytics">
      <h2 className="block-title">Аналитика</h2>
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-circle" style={{ '--pct': s.value, '--clr': s.color }}>
              <span className="stat-num">{s.value}%</span>
            </div>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
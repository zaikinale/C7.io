export default function AttachedSimpleList({ title, items, icon: Icon, onRemove, onNavigate, renderLabel }) {
  if (items.length === 0) return null

  return (
    <div className="md-modal-section">
      <h4>{title}</h4>
      <div className={`md-modal-selected-${title === 'Участники' ? 'users' : 'notes'}`}>
        {items.map(id => {
          const label = renderLabel(id)
          if (!label) return null
          return (
            <div key={id} className={`md-modal-${title === 'Участники' ? 'user' : 'note'}-tag`} onClick={() => onNavigate(id)} title="Открыть">
              <Icon />
              <span>{label}</span>
              <button onClick={(e) => { e.stopPropagation(); onRemove(id); }}>×</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
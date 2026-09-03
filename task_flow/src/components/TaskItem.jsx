import { useState } from 'react'

function formatDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  const saveEdit = () => {
    const trimmed = editValue.trim()
    if (!trimmed) return
    onEdit(task.id, trimmed)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditValue(task.title)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') saveEdit()
    if (event.key === 'Escape') cancelEdit()
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`} role="listitem">
      {isEditing ? (
        <>
          <input
            type="text"
            className="task-edit-input"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="task-edit-actions">
            <button className="btn btn-sm btn-primary" onClick={saveEdit}>Save</button>
            <button className="btn btn-sm btn-ghost" onClick={cancelEdit}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <button className="btn-icon" onClick={() => onToggle(task.id)} aria-label={task.completed ? 'Mark as pending' : 'Mark complete'}>
            {task.completed ? '◷' : '✓'}
          </button>
          <span className="task-title">{task.title}</span>
          <span className="task-meta">
            Added {formatDate(task.createdAt)}
            {task.completed && task.completedAt && <> · Done {formatDate(task.completedAt)}</>}
          </span>
          <div className="task-actions">
            <button className="btn-icon" onClick={() => { setEditValue(task.title); setIsEditing(true) }} aria-label="Edit task">✎</button>
            <button className="btn-icon danger" onClick={() => onDelete(task.id)} aria-label="Delete task">⌫</button>
          </div>
        </>
      )}
    </div>
  )
}
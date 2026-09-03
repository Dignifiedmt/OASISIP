import React from 'react'
import TaskItem from './TaskItem'

export default function TaskList({ title, tasks, onToggle, onEdit, onDelete, emptyMessage, completed }) {
  return (
    <section className="task-list-section" aria-label={`${title} tasks`}>
      <div className="list-header">
        <h2 className="list-title">
          <span className="list-title-icon">
            {completed ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
          </span>
          {title}
        </h2>
        <span className="list-badge">{tasks.length}</span>
      </div>
      <div className="task-list" role="list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>{title === 'Pending' ? 'No pending tasks' : 'No completed tasks yet'}</p>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  )
}
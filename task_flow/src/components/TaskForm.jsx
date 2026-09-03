import React, { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Please enter a task.')
      return
    }
    setError('')
    onAdd(trimmed)
    setInput('')
  }

  return (
    <section className="task-creation" aria-label="Create a new task">
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="taskInput" className="visually-hidden">Task title</label>
          <input
            type="text"
            id="taskInput"
            className="task-input"
            placeholder="What do you need to do?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-describedby="taskError"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>
        <div id="taskError" className="form-error" aria-live="polite">{error}</div>
      </form>
    </section>
  )
}
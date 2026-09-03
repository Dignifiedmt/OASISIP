import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Summary from './Summary'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import DeleteModal from './DeleteModal'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
}

function App() {
  const [tasks, setTasks] = useLocalStorage('taskflow_tasks', [])
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const addTask = (title) => {
    const newTask = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setTasks([newTask, ...tasks])
  }

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id))

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => task.id === id ? {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
    } : task))
  }

  const editTask = (id, newTitle) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, title: newTitle.trim() } : task))
  }

  const clearCompleted = () => setTasks(tasks.filter((task) => !task.completed))

  const openDeleteModal = (id) => {
    setDeleteTargetId(id)
    setModalOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTargetId) deleteTask(deleteTargetId)
    setDeleteTargetId(null)
    setModalOpen(false)
  }

  const cancelDelete = () => {
    setDeleteTargetId(null)
    setModalOpen(false)
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="app">
      <header className="app-header">
        <div className="container header-inner">
          <div className="brand">
            <svg className="brand-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="brand-name">TaskFlow</span>
            <span className="brand-tagline">organize · track · complete</span>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost btn-sm" onClick={clearCompleted} aria-label="Clear all completed tasks">
              Clear Completed
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Summary total={tasks.length} pending={pendingTasks.length} completed={completedTasks.length} />
          <TaskForm onAdd={addTask} />
          <div className="lists-grid">
            <TaskList title="Pending" tasks={pendingTasks} onToggle={toggleComplete} onEdit={editTask} onDelete={openDeleteModal} emptyMessage="No pending tasks. You're all caught up!" />
            <TaskList title="Completed" tasks={completedTasks} onToggle={toggleComplete} onEdit={editTask} onDelete={openDeleteModal} emptyMessage="No completed tasks yet. Get to work!" completed />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2026 TaskFlow &middot; Oasis Infobyte SIP &middot; Level 2 – Task 3</p>
        </div>
      </footer>

      <DeleteModal isOpen={modalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} />
    </div>
  )
}

export default App
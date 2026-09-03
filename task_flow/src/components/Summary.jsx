import React from 'react'

export default function Summary({ total, pending, completed }) {
  return (
    <section className="summary-grid" aria-label="Task summary">
      <div className="summary-card">
        <span className="summary-label">Total</span>
        <span className="summary-value">{total}</span>
      </div>
      <div className="summary-card summary-pending">
        <span className="summary-label">Pending</span>
        <span className="summary-value">{pending}</span>
      </div>
      <div className="summary-card summary-completed">
        <span className="summary-label">Completed</span>
        <span className="summary-value">{completed}</span>
      </div>
    </section>
  )
}
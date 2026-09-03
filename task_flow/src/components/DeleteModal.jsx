import React from 'react'

export default function DeleteModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-card">
        <h3 id="modalTitle" className="modal-title">Delete this task?</h3>
        <p className="modal-message">This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
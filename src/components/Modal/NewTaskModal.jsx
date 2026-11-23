import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import Button from '../Common/Button';
import './NewTaskModal.css';

/**
 * NewTaskModal Component.
 * Demonstrates:
 * - Controlled form inputs using local state (useState)
 * - Synthetic event handling (onSubmit, onChange, e.preventDefault)
 * - Validation logic inside functional components
 * - Lifting state up by calling onAddTask(data) passed via props
 */
export default function NewTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [assignee, setAssignee] = useState('Bhushan B.');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('Today, 5:00 PM');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      category,
      assignee,
      priority,
      status: 'In Progress',
      dueDate
    };

    onAddTask(newTask);
    
    // Reset form fields
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal body
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header__title-group">
            <PlusCircle className="modal-header__icon" size={22} />
            <h3 id="modal-title" className="modal-title">Create New Task</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="task-title" className="form-label">Task Title</label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g., Integrate PostgreSQL migration files"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-category" className="form-label">Category</label>
              <select
                id="task-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Frontend">Frontend (React)</option>
                <option value="Backend">Backend (Node/Express)</option>
                <option value="Database">Database (Postgres)</option>
                <option value="Architecture">Architecture</option>
                <option value="Training">Intern Training</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">Priority</label>
              <select
                id="task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-assignee" className="form-label">Assignee</label>
              <input
                id="task-assignee"
                type="text"
                className="form-input"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-duedate" className="form-label">Due By</label>
              <input
                id="task-duedate"
                type="text"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

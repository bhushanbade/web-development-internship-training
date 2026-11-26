import React, { useState, useId } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle2, Loader2, Bug } from 'lucide-react';
import Button from '../Common/Button';
import './NewTaskModal.css';

/**
 * NewTaskModal Component — Demonstrates Advanced Controlled Forms & Validation (Day 2).
 * 
 * Features:
 * 1. Controlled Inputs: Every field's value is synchronized with React state.
 * 2. Touch Tracking: Errors are displayed only after a field has been blurred (touched).
 * 3. Comprehensive Validation: Required fields, length bounds, and date checks.
 * 4. Submit State: Disables submission when form is invalid or during asynchronous dispatch.
 * 5. Simulation Mode: Allows mentors to toggle simulated API failures (HTTP 422) directly.
 */
export default function NewTaskModal({ isOpen, onClose, onAddTask }) {
  const formId = useId();

  // 1. Multi-field Form Values State (Lazy initialized for pure render)
  const [values, setValues] = useState(() => ({
    title: '',
    category: 'Frontend',
    priority: 'Medium',
    assignee: 'Bhushan Bade',
    dueDate: '2026-11-28',
    description: ''
  }));

  // 2. Touched Fields State (tracks when user blurs an input)
  const [touched, setTouched] = useState({});

  // 3. Asynchronous Submission & Error State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [simulateServerError, setSimulateServerError] = useState(false);

  if (!isOpen) return null;

  // Validation Logic (Pure function evaluating current form values)
  const validate = (formValues) => {
    const errs = {};

    // Title validation
    if (!formValues.title.trim()) {
      errs.title = 'Task title is required.';
    } else if (formValues.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters.';
    } else if (formValues.title.trim().length > 100) {
      errs.title = 'Title cannot exceed 100 characters.';
    }

    // Assignee validation
    if (!formValues.assignee.trim()) {
      errs.assignee = 'Assignee name is required.';
    } else if (formValues.assignee.trim().length < 2) {
      errs.assignee = 'Assignee name must be at least 2 characters.';
    }

    // Due Date validation
    if (!formValues.dueDate) {
      errs.dueDate = 'Due date is required.';
    }

    // Description validation
    if (!formValues.description.trim()) {
      errs.description = 'Task description is required.';
    } else if (formValues.description.trim().length < 10) {
      errs.description = `Description must be at least 10 characters (currently ${formValues.description.trim().length}).`;
    }

    return errs;
  };

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  // Change Handler for Controlled Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (serverError) setServerError('');
  };

  // Blur Handler for Touch Tracking
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to display any remaining validation errors
    setTouched({
      title: true,
      category: true,
      priority: true,
      assignee: true,
      dueDate: true,
      description: true
    });

    if (!isValid) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await onAddTask(
        {
          ...values,
          title: values.title.trim(),
          assignee: values.assignee.trim(),
          description: values.description.trim(),
          status: 'In Progress'
        },
        simulateServerError
      );

      // Reset form on success and close
      setValues({
        title: '',
        category: 'Frontend',
        priority: 'Medium',
        assignee: 'Bhushan Bade',
        dueDate: new Date().toISOString().split('T')[0],
        description: ''
      });
      setTouched({});
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to submit task to API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-modal-title`}
      >
        <div className="modal-header">
          <div className="modal-header__title-group">
            <PlusCircle className="modal-header__icon" size={22} />
            <div>
              <h3 id={`${formId}-modal-title`} className="modal-title">
                Create Sprint Task (API POST)
              </h3>
              <span className="modal-subtitle">Day 2 Controlled Form with Touch & Field Validation</span>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {serverError && (
            <div className="modal-error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Title Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor={`${formId}-title`} className="form-label">
                Task Title <span className="form-required">*</span>
              </label>
              {touched.title && !errors.title && (
                <span className="form-valid-indicator">
                  <CheckCircle2 size={13} /> Valid
                </span>
              )}
            </div>
            <input
              id={`${formId}-title`}
              name="title"
              type="text"
              className={`form-input ${touched.title && errors.title ? 'form-input--error' : ''}`}
              placeholder="e.g., Integrate PostgreSQL connection pooling"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              autoFocus
            />
            {touched.title && errors.title && (
              <span className="form-error-msg" role="alert">
                <AlertCircle size={13} /> {errors.title}
              </span>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`${formId}-category`} className="form-label">
                Category <span className="form-required">*</span>
              </label>
              <select
                id={`${formId}-category`}
                name="category"
                className="form-select"
                value={values.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Frontend">Frontend (React)</option>
                <option value="Backend">Backend (Node/Express)</option>
                <option value="Database">Database (Postgres)</option>
                <option value="Architecture">Architecture</option>
                <option value="Testing">Testing & QA</option>
                <option value="Training">Intern Training</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-priority`} className="form-label">
                Priority <span className="form-required">*</span>
              </label>
              <select
                id={`${formId}-priority`}
                name="priority"
                className="form-select"
                value={values.priority}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Grid */}
          <div className="form-row">
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor={`${formId}-assignee`} className="form-label">
                  Assignee <span className="form-required">*</span>
                </label>
                {touched.assignee && !errors.assignee && (
                  <span className="form-valid-indicator">
                    <CheckCircle2 size={13} /> Valid
                  </span>
                )}
              </div>
              <input
                id={`${formId}-assignee`}
                name="assignee"
                type="text"
                className={`form-input ${touched.assignee && errors.assignee ? 'form-input--error' : ''}`}
                value={values.assignee}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {touched.assignee && errors.assignee && (
                <span className="form-error-msg" role="alert">
                  <AlertCircle size={13} /> {errors.assignee}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-dueDate`} className="form-label">
                Target Due Date <span className="form-required">*</span>
              </label>
              <input
                id={`${formId}-dueDate`}
                name="dueDate"
                type="date"
                className={`form-input ${touched.dueDate && errors.dueDate ? 'form-input--error' : ''}`}
                value={values.dueDate}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {touched.dueDate && errors.dueDate && (
                <span className="form-error-msg" role="alert">
                  <AlertCircle size={13} /> {errors.dueDate}
                </span>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor={`${formId}-description`} className="form-label">
                Task Description & Acceptance Criteria <span className="form-required">*</span>
              </label>
              <span className="form-char-count">{values.description.length} chars</span>
            </div>
            <textarea
              id={`${formId}-description`}
              name="description"
              rows={3}
              className={`form-textarea ${touched.description && errors.description ? 'form-input--error' : ''}`}
              placeholder="Describe what needs to be implemented and verified..."
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.description && errors.description && (
              <span className="form-error-msg" role="alert">
                <AlertCircle size={13} /> {errors.description}
              </span>
            )}
          </div>

          {/* Mentor Testing Feature: Simulate Server Failure */}
          <div className="form-test-mode">
            <label className="test-mode-toggle">
              <input
                type="checkbox"
                checked={simulateServerError}
                onChange={(e) => setSimulateServerError(e.target.checked)}
              />
              <span className="test-mode-label">
                <Bug size={14} /> Simulate Server Rejection (HTTP 422) for mentor testing
              </span>
            </label>
          </div>

          {/* Modal Form Actions */}
          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose} type="button" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || (Object.keys(touched).length > 0 && !isValid)}
              icon={isSubmitting ? Loader2 : PlusCircle}
            >
              {isSubmitting ? 'Submitting to API...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

/**
 * Toast Notification Component — Demonstrates Success UI State.
 * Automatically dismisses after `duration` ms with useEffect cleanup timer.
 */
export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // Cleanup timer on unmount or update
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast__icon toast__icon--success" />,
    error: <AlertTriangle size={18} className="toast__icon toast__icon--error" />,
    info: <Info size={18} className="toast__icon toast__icon--info" />
  };

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <div className="toast__content">
        {icons[type] || icons.success}
        <span className="toast__message">{message}</span>
      </div>
      <button
        type="button"
        className="toast__close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

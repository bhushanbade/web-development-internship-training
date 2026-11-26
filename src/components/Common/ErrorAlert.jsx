import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import Button from './Button';
import './ErrorAlert.css';

/**
 * ErrorAlert Component — Demonstrates Error UI State.
 * Renders error details and an actionable Retry button.
 */
export default function ErrorAlert({
  title = 'Failed to load data',
  message = 'An unexpected network error occurred while communicating with the API.',
  onRetry,
  isRetrying = false
}) {
  return (
    <div className="error-alert" role="alert">
      <div className="error-alert__icon-wrapper">
        <AlertOctagon size={28} className="error-alert__icon" />
      </div>
      <div className="error-alert__body">
        <h4 className="error-alert__title">{title}</h4>
        <p className="error-alert__message">{message}</p>
        {onRetry && (
          <div className="error-alert__actions">
            <Button
              variant="danger"
              size="small"
              icon={RotateCcw}
              onClick={onRetry}
              disabled={isRetrying}
            >
              {isRetrying ? 'Retrying Connection...' : 'Retry Request'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

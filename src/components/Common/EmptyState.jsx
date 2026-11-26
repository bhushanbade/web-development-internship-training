import React from 'react';
import { SearchX, Plus, RefreshCw } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

/**
 * EmptyState Component — Demonstrates Empty UI State.
 * Handles both "no results matching search" and "no data created yet".
 */
export default function EmptyState({
  title = 'No tasks found',
  description = 'Try adjusting your search criteria, clear filters, or create a new task.',
  actionLabel = 'Create Task',
  onAction,
  onResetFilters,
  icon: Icon = SearchX
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon-box">
        <Icon size={36} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__desc">{description}</p>
      
      <div className="empty-state__actions">
        {onResetFilters && (
          <Button variant="secondary" size="small" icon={RefreshCw} onClick={onResetFilters}>
            Reset Filters
          </Button>
        )}
        {onAction && (
          <Button variant="primary" size="small" icon={Plus} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

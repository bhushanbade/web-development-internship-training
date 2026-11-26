import React from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  Tag, 
  User, 
  Search, 
  Filter, 
  RotateCcw, 
  Bug, 
  Clock 
} from 'lucide-react';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import { SkeletonTaskRow } from '../Common/Skeleton';
import ErrorAlert from '../Common/ErrorAlert';
import EmptyState from '../Common/EmptyState';
import './TaskList.css';

/**
 * TaskList Component — Searchable List View for Day 2.
 * 
 * Demonstrates:
 * 1. Loading UI State: Skeleton placeholder rows while asynchronous fetching is active.
 * 2. Error UI State: Interactive ErrorAlert with retry mechanism.
 * 3. Empty UI State: Dedicated EmptyState graphic when filters return 0 results.
 * 4. Success UI State: Fully responsive, interactive data grid.
 * 5. Mentor Simulation Bar: Live controls to test network latency & server errors.
 */
export default function TaskList({
  tasks = [],
  isLoading = false,
  error = null,
  onRetry,
  onToggleStatus,
  onDeleteTask,
  searchQuery = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  priorityFilter = 'all',
  onPriorityFilterChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  onResetFilters,
  onOpenCreateModal,
  // Mentor Testing Props
  simulateError = false,
  onToggleSimulateError,
  slowNetwork = false,
  onToggleSlowNetwork
}) {
  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'info';
      case 'pending': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="task-view-container">
      {/* 1. Mentor Testing Toolbar */}
      <section className="mentor-toolbar" aria-label="Mentor Testing Controls">
        <div className="mentor-toolbar__label">
          <Bug size={14} className="mentor-toolbar__icon" />
          <span>Mentor Testing Controls (Day 2 Async Verification):</span>
        </div>
        <div className="mentor-toolbar__toggles">
          <label className="mentor-toggle">
            <input
              type="checkbox"
              checked={slowNetwork}
              onChange={(e) => onToggleSlowNetwork(e.target.checked)}
            />
            <span className="mentor-toggle__text">
              <Clock size={13} /> Slow Network (1.5s delay)
            </span>
          </label>

          <label className="mentor-toggle mentor-toggle--danger">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => onToggleSimulateError(e.target.checked)}
            />
            <span className="mentor-toggle__text">
              <RotateCcw size={13} /> Simulate API 500 Error
            </span>
          </label>
        </div>
      </section>

      {/* 2. Search & Multi-Filter Control Bar */}
      <div className="task-filter-bar">
        {/* Search Input Field */}
        <div className="task-filter-bar__search">
          <Search size={16} className="task-filter-bar__search-icon" />
          <input
            type="text"
            className="task-filter-bar__search-input"
            placeholder="Search by title, assignee, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search sprint tasks"
          />
          {searchQuery && (
            <button
              type="button"
              className="task-filter-bar__clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="task-filter-bar__selects">
          {/* Status Filter */}
          <div className="select-wrapper">
            <Filter size={13} className="select-icon" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="filter-select"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="select-wrapper">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="filter-select"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="select-wrapper">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="filter-select"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Architecture">Architecture</option>
              <option value="Testing">Testing</option>
              <option value="Training">Training</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
            <Button variant="ghost" size="small" onClick={onResetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* 3. Conditional Rendering of the 4 Async UI States */}

      {/* STATE A: ERROR UI STATE */}
      {error && !isLoading && (
        <ErrorAlert
          title="API Connection Failed (HTTP 500)"
          message={error.message || 'Unable to retrieve tasks from server. The simulated network error is active.'}
          onRetry={onRetry}
          isRetrying={isLoading}
        />
      )}

      {/* STATE B: DATA TABLE (Handles Loading Skeletons and Success Records) */}
      {(!error || isLoading) && (
        <div className="task-list">
          <div className="task-list__table-wrapper">
            <table className="task-list__table">
              <thead>
                <tr>
                  <th className="task-list__th task-list__th--status">Status</th>
                  <th className="task-list__th task-list__th--title">Task Details</th>
                  <th className="task-list__th">Category</th>
                  <th className="task-list__th">Assignee</th>
                  <th className="task-list__th">Priority</th>
                  <th className="task-list__th">Due Date</th>
                  <th className="task-list__th task-list__th--actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* STATE C: LOADING SKELETON STATE */}
                {isLoading ? (
                  <>
                    <SkeletonTaskRow />
                    <SkeletonTaskRow />
                    <SkeletonTaskRow />
                    <SkeletonTaskRow />
                  </>
                ) : tasks.length > 0 ? (
                  /* STATE D: SUCCESS STATE (Render Data Rows) */
                  tasks.map((task) => {
                    const isCompleted = task.status?.toLowerCase() === 'completed';

                    return (
                      <tr
                        key={task.id}
                        className={`task-list__row ${isCompleted ? 'task-list__row--completed' : ''}`}
                      >
                        {/* Status Toggle Checkbox */}
                        <td className="task-list__td">
                          <button
                            type="button"
                            className={`task-list__status-toggle ${isCompleted ? 'task-list__status-toggle--done' : ''}`}
                            onClick={() => onToggleStatus(task.id, isCompleted ? 'In Progress' : 'Completed')}
                            title={isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </td>

                        {/* Title & Description */}
                        <td className="task-list__td">
                          <div className="task-list__title-group">
                            <span className={`task-list__item-title ${isCompleted ? 'task-list__item-title--strikethrough' : ''}`}>
                              {task.title}
                            </span>
                            <Badge variant={getStatusVariant(task.status)} size="small">
                              {task.status}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="task-list__item-desc">{task.description}</p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="task-list__td">
                          <span className="task-list__meta-item">
                            <Tag size={13} className="task-list__meta-icon" />
                            {task.category}
                          </span>
                        </td>

                        {/* Assignee */}
                        <td className="task-list__td">
                          <span className="task-list__meta-item">
                            <User size={13} className="task-list__meta-icon" />
                            {task.assignee}
                          </span>
                        </td>

                        {/* Priority Badge */}
                        <td className="task-list__td">
                          <Badge variant={getPriorityVariant(task.priority)} size="small">
                            {task.priority}
                          </Badge>
                        </td>

                        {/* Due Date */}
                        <td className="task-list__td">
                          <span className="task-list__meta-item">
                            <Calendar size={13} className="task-list__meta-icon" />
                            {task.dueDate}
                          </span>
                        </td>

                        {/* Delete Action */}
                        <td className="task-list__td task-list__td--actions">
                          <button
                            type="button"
                            className="task-list__action-btn task-list__action-btn--delete"
                            onClick={() => onDeleteTask(task.id)}
                            title="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : null}
              </tbody>
            </table>
          </div>

          {/* STATE E: EMPTY UI STATE (When query returns 0 items) */}
          {!isLoading && !error && tasks.length === 0 && (
            <EmptyState
              title={searchQuery ? `No tasks found matching "${searchQuery}"` : 'No sprint tasks found'}
              description={
                searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                  ? 'None of your active tasks match the current filter criteria. Try resetting your filters.'
                  : 'Your sprint board is currently empty. Create your first task to get started.'
              }
              actionLabel="Create Task"
              onAction={onOpenCreateModal}
              onResetFilters={
                searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                  ? onResetFilters
                  : null
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

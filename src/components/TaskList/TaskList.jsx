import React from 'react';
import { CheckCircle2, Trash2, Calendar, Tag, User } from 'lucide-react';
import Badge from '../Common/Badge';
import './TaskList.css';

/**
 * TaskList component.
 * Demonstrates:
 * - Props receiving (tasks, onToggleStatus, onDeleteTask)
 * - Conditional rendering for empty state vs task rows
 * - List rendering with keys
 * - Status & Priority badge mapping
 * - Event propagation and button click handlers
 */
export default function TaskList({ tasks = [], onToggleStatus, onDeleteTask }) {
  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'info';
      case 'pending': return 'warning';
      default: return 'neutral';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon">📋</div>
        <h4 className="task-list__empty-title">No matching tasks found</h4>
        <p className="task-list__empty-desc">
          Try adjusting your search query or create a new task to get started.
        </p>
      </div>
    );
  }

  return (
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
            {tasks.map((task) => {
              const isCompleted = task.status.toLowerCase() === 'completed';

              return (
                <tr key={task.id} className={`task-list__row ${isCompleted ? 'task-list__row--completed' : ''}`}>
                  {/* Status Toggle / Checkbox */}
                  <td className="task-list__td">
                    <button
                      type="button"
                      className={`task-list__status-toggle ${isCompleted ? 'task-list__status-toggle--done' : ''}`}
                      onClick={() => onToggleStatus(task.id)}
                      title={isCompleted ? "Mark as In Progress" : "Mark as Completed"}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </td>

                  {/* Task Title & Status Badge */}
                  <td className="task-list__td">
                    <div className="task-list__title-group">
                      <span className={`task-list__item-title ${isCompleted ? 'task-list__item-title--strikethrough' : ''}`}>
                        {task.title}
                      </span>
                      <Badge variant={getStatusVariant(task.status)} size="small">
                        {task.status}
                      </Badge>
                    </div>
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

                  {/* Priority */}
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import Button from '../Common/Button';
import './Header.css';

/**
 * Reusable Header component.
 * Demonstrates:
 * - Props receiving (pageTitle, pageSubtitle, user, searchQuery, onSearchChange, onNewTaskClick)
 * - Controlled input pattern for the search bar
 * - Subcomponent composition (using Button)
 * - Event delegation for user interactions
 */
export default function Header({
  pageTitle = 'Dashboard Overview',
  pageSubtitle = 'Monitor operational metrics and track sprint deliveries',
  user = { name: 'Bhushan Bade', role: 'Full Stack Intern', initials: 'BB' },
  searchQuery = '',
  onSearchChange,
  onNewTaskClick,
  notificationCount = 3
}) {
  return (
    <header className="header">
      {/* Title & Context */}
      <div className="header__title-section">
        <h1 className="header__title">{pageTitle}</h1>
        <p className="header__subtitle">{pageSubtitle}</p>
      </div>

      {/* Action Controls & User Profile */}
      <div className="header__actions">
        {/* Search Input Bar */}
        <div className="header__search">
          <Search className="header__search-icon" size={17} />
          <input
            type="text"
            className="header__search-input"
            placeholder="Search tasks, members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search"
          />
        </div>

        {/* Primary Quick Action Button */}
        <Button 
          variant="primary" 
          size="medium" 
          icon={Plus} 
          onClick={onNewTaskClick}
        >
          New Task
        </Button>

        {/* Notification Bell */}
        <div className="header__notification-wrapper">
          <button 
            type="button" 
            className="header__icon-btn" 
            aria-label="Notifications"
            title={`${notificationCount} unread notifications`}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="header__notification-dot">{notificationCount}</span>
            )}
          </button>
        </div>

        {/* User Profile Capsule */}
        <div className="header__user-profile">
          <div className="header__avatar" title={user.name}>
            <span>{user.initials}</span>
            <span className="header__avatar-status" />
          </div>
          <div className="header__user-info">
            <span className="header__user-name">{user.name}</span>
            <span className="header__user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

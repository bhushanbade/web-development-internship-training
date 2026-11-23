import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

// Icon registry mapping string icon keys to Lucide icon components
const iconMap = {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart3,
  Settings
};

/**
 * Reusable Navigation Sidebar component.
 * Demonstrates:
 * - Props: items, activeTab, onSelectTab, isCollapsed, onToggleCollapse
 * - Dynamic rendering with Array.map() and key props
 * - Event handling via callback props (lifting state up)
 */
export default function Sidebar({
  items = [],
  activeTab = 'overview',
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse
}) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand Logo & Name */}
      <div className="sidebar__brand">
        <div className="sidebar__logo-icon">
          <Layers size={22} color="#ffffff" />
        </div>
        {!isCollapsed && (
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-title">PugArch</span>
            <span className="sidebar__brand-badge">OpsHub</span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="sidebar__nav" aria-label="Main Navigation">
        <span className="sidebar__section-label">
          {!isCollapsed ? 'MAIN MENU' : '•••'}
        </span>
        <ul className="sidebar__menu">
          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="sidebar__menu-item">
                <button
                  type="button"
                  className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComponent className="sidebar__link-icon" size={20} />
                  {!isCollapsed && <span className="sidebar__link-label">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="sidebar__badge">{item.badge}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__toggle-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}

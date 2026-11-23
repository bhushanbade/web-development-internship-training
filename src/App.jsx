import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Layers, 
  Users, 
  Filter,
  Check,
  Clock,
  Code2
} from 'lucide-react';

// Subcomponents
import Sidebar from './components/Navigation/Sidebar';
import Header from './components/Header/Header';
import SummaryCard from './components/SummaryCard/SummaryCard';
import TaskList from './components/TaskList/TaskList';
import NewTaskModal from './components/Modal/NewTaskModal';
import Button from './components/Common/Button';
import Badge from './components/Common/Badge';

// Mock Data
import { initialStats, initialTasks, navigationItems } from './data/mockData';
import './App.css';

/**
 * App Component - Root Component for Day 1 Hands-on Task.
 * 
 * Demonstrates:
 * 1. Functional Components: Pure, readable functions returning JSX.
 * 2. State Management (useState):
 *    - activeTab: controls which view is currently displayed.
 *    - isSidebarCollapsed: toggles sidebar width between expanded and compact.
 *    - filterPeriod: switches summary metrics between 'today', 'week', and 'month'.
 *    - searchQuery: controls search term and filters task items in real-time.
 *    - isTaskModalOpen: controls visibility of the task creation dialog.
 *    - tasks: stores array of tasks, demonstrating immutable state updates.
 * 3. Props: Passing values, objects, and callback functions down to children.
 * 4. Events: Handling user clicks, inputs, and form submissions.
 * 5. Component Composition: Composing independent components into a cohesive dashboard.
 */
function App() {
  // 1. Navigation State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 2. Metrics & Filtering State
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // 4. Tasks State (Immutable CRUD operations)
  const [tasks, setTasks] = useState(initialTasks);

  // Dynamic calculations based on state
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const currentPeriodStats = initialStats[filterPeriod];

  // Filtered tasks based on search input
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query) ||
      task.assignee.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query)
    );
  });

  // Event Handlers (demonstrating lifting state up)
  const handleToggleTaskStatus = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleAddNewTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  return (
    <div className="app-layout">
      {/* 1. Reusable Navigation Sidebar */}
      <Sidebar
        items={navigationItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="app-main-wrapper">
        {/* 2. Reusable Header */}
        <Header
          pageTitle={
            activeTab === 'overview'
              ? 'Executive Dashboard'
              : activeTab === 'tasks'
              ? 'Task & Sprint Management'
              : activeTab === 'team'
              ? 'Team Directory'
              : activeTab === 'analytics'
              ? 'Velocity & Performance'
              : 'Settings & Environment'
          }
          pageSubtitle="PugArch Web Development Intern Capstone - Day 1 Architecture"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewTaskClick={() => setIsTaskModalOpen(true)}
          notificationCount={3}
        />

        {/* 3. Main Dashboard Content Area */}
        <main className="app-content">
          {/* Day 1 Concept Showcase Banner */}
          <section className="learning-banner">
            <div className="learning-banner__content">
              <div className="learning-banner__tag">
                <Code2 size={15} />
                <span>Day 1 Milestones Accomplished</span>
              </div>
              <h2 className="learning-banner__title">
                React Foundations & Component Thinking
              </h2>
              <p className="learning-banner__desc">
                Built with JSX, functional components, unidirectional props flow, and local state management (<code>useState</code>). All components adhere to clean composition patterns.
              </p>
            </div>
            <div className="learning-banner__badges">
              <Badge variant="info">Functional Components</Badge>
              <Badge variant="success">Unidirectional Props</Badge>
              <Badge variant="warning">Controlled Inputs</Badge>
              <Badge variant="neutral">Modular CSS</Badge>
            </div>
          </section>

          {/* Timeframe Filter Bar */}
          <section className="filter-toolbar">
            <div className="filter-toolbar__left">
              <span className="filter-toolbar__label">
                <Filter size={15} />
                <span>Timeframe:</span>
              </span>
              <div className="filter-toolbar__buttons">
                {['today', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`filter-btn ${filterPeriod === period ? 'filter-btn--active' : ''}`}
                    onClick={() => setFilterPeriod(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-toolbar__right">
              <span className="filter-toolbar__timestamp">
                <Clock size={14} />
                <span>Live View &bull; Period: {filterPeriod.toUpperCase()}</span>
              </span>
            </div>
          </section>

          {/* 4. Reusable Summary Cards Grid */}
          <section className="summary-cards-grid">
            <SummaryCard
              title="Total Tasks"
              value={filterPeriod === 'today' ? tasks.length : currentPeriodStats.totalTasks}
              change={currentPeriodStats.trends.totalTasks}
              changeType="positive"
              icon={CheckSquare}
              accentColor="#2563eb"
              trendLabel="active items"
            />

            <SummaryCard
              title="Completed Tasks"
              value={filterPeriod === 'today' ? completedCount : currentPeriodStats.completedTasks}
              change={currentPeriodStats.trends.completedTasks}
              changeType="positive"
              icon={CheckCircle2}
              accentColor="#059669"
              trendLabel="verified done"
            />

            <SummaryCard
              title="Active Sprints"
              value={currentPeriodStats.activeProjects}
              change={currentPeriodStats.trends.activeProjects}
              changeType="neutral"
              icon={Layers}
              accentColor="#7c3aed"
              trendLabel="in progress"
            />

            <SummaryCard
              title="Team Velocity"
              value={currentPeriodStats.teamAvailability}
              change={currentPeriodStats.trends.teamAvailability}
              changeType="positive"
              icon={Users}
              accentColor="#d97706"
              trendLabel="capacity rating"
            />
          </section>

          {/* Tab Specific Views */}
          {activeTab === 'overview' && (
            <div className="dashboard-grid">
              {/* Left Column: Tasks List */}
              <div className="dashboard-grid__left">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Sprint Tasks</h3>
                    <p className="section-subtitle">
                      Showing {filteredTasks.length} of {tasks.length} total tasks
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="small" 
                    onClick={() => setIsTaskModalOpen(true)}
                  >
                    + Add Row
                  </Button>
                </div>

                <TaskList
                  tasks={filteredTasks}
                  onToggleStatus={handleToggleTaskStatus}
                  onDeleteTask={handleDeleteTask}
                />
              </div>

              {/* Right Column: Day 1 Component Tree Inspector & Team Widget */}
              <aside className="dashboard-grid__right">
                {/* Component Architecture Card */}
                <div className="panel-card">
                  <div className="panel-card__header">
                    <h4 className="panel-card__title">Component Tree Structure</h4>
                    <Badge variant="info" size="small">Day 1 Spec</Badge>
                  </div>
                  <div className="panel-card__body">
                    <pre className="tree-preview">
{`App (State: tab, filter, tasks)
├── Sidebar (Nav Items)
├── Header (Title, User, Search)
├── FilterToolbar (Timeframe)
├── SummaryCards Grid
│   ├── SummaryCard (Total)
│   ├── SummaryCard (Done)
│   ├── SummaryCard (Sprints)
│   └── SummaryCard (Velocity)
├── TaskList (Filtered Tasks)
│   └── TaskRow[] ── Badge
└── NewTaskModal (Controlled Form)`}
                    </pre>
                    <p className="tree-description">
                      Data flows downwards via <strong>props</strong>. User actions emit events upward to update parent state via <strong>callbacks</strong>.
                    </p>
                  </div>
                </div>

                {/* Team Quick Info Card */}
                <div className="panel-card">
                  <div className="panel-card__header">
                    <h4 className="panel-card__title">Team Roster</h4>
                    <span className="panel-card__meta">4 Online</span>
                  </div>
                  <ul className="team-roster">
                    <li className="team-roster__item">
                      <div className="team-roster__avatar">BS</div>
                      <div className="team-roster__info">
                        <span className="team-roster__name">Bhushan Sonawane</span>
                        <span className="team-roster__role">Full Stack Intern</span>
                      </div>
                      <Badge variant="success" size="small">Lead</Badge>
                    </li>
                    <li className="team-roster__item">
                      <div className="team-roster__avatar" style={{ background: '#059669' }}>AR</div>
                      <div className="team-roster__info">
                        <span className="team-roster__name">Alex Rivera</span>
                        <span className="team-roster__role">Frontend Engineer</span>
                      </div>
                      <Badge variant="neutral" size="small">Active</Badge>
                    </li>
                    <li className="team-roster__item">
                      <div className="team-roster__avatar" style={{ background: '#7c3aed' }}>SC</div>
                      <div className="team-roster__info">
                        <span className="team-roster__name">Sarah Chen</span>
                        <span className="team-roster__role">Backend Specialist</span>
                      </div>
                      <Badge variant="neutral" size="small">Active</Badge>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tab-pane">
              <div className="section-header">
                <div>
                  <h3 className="section-title">All Project Tasks</h3>
                  <p className="section-subtitle">Manage assignments, priorities, and deadlines</p>
                </div>
                <Button 
                  variant="primary" 
                  size="medium" 
                  onClick={() => setIsTaskModalOpen(true)}
                >
                  + Create New Task
                </Button>
              </div>
              <TaskList
                tasks={filteredTasks}
                onToggleStatus={handleToggleTaskStatus}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}

          {activeTab === 'team' && (
            <div className="tab-pane">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Engineering Team</h3>
                  <p className="section-subtitle">Current active contributors for the 20-Day sprint</p>
                </div>
              </div>
              <div className="team-grid">
                {[
                  { name: 'Bhushan Sonawane', role: 'Full Stack Intern', focus: 'React, TypeScript, APIs', avatar: 'BS' },
                  { name: 'Alex Rivera', role: 'Frontend Engineer', focus: 'UI Systems & Accessibility', avatar: 'AR' },
                  { name: 'Sarah Chen', role: 'Backend Engineer', focus: 'Express, PostgreSQL, Laravel', avatar: 'SC' },
                  { name: 'David Kim', role: 'DevOps & QA', focus: 'CI/CD, Testing Library', avatar: 'DK' },
                ].map((member) => (
                  <div key={member.name} className="team-card">
                    <div className="team-card__avatar">{member.avatar}</div>
                    <h4 className="team-card__name">{member.name}</h4>
                    <span className="team-card__role">{member.role}</span>
                    <p className="team-card__focus">{member.focus}</p>
                    <Badge variant="info" size="small">Available</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="tab-pane">
              <div className="panel-card">
                <div className="panel-card__header">
                  <h4 className="panel-card__title">Sprint Performance Overview</h4>
                  <Badge variant="success">96% On Track</Badge>
                </div>
                <div className="analytics-summary">
                  <div className="analytics-metric">
                    <span className="metric-val">{completedCount}</span>
                    <span className="metric-lbl">Completed Tasks</span>
                  </div>
                  <div className="analytics-metric">
                    <span className="metric-val">{inProgressCount}</span>
                    <span className="metric-lbl">In Progress</span>
                  </div>
                  <div className="analytics-metric">
                    <span className="metric-val">
                      {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                    </span>
                    <span className="metric-lbl">Current Completion Rate</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-pane">
              <div className="panel-card">
                <div className="panel-card__header">
                  <h4 className="panel-card__title">Curriculum & Mentor Verification Checklist</h4>
                </div>
                <div className="settings-checklist">
                  <div className="checklist-item checklist-item--done">
                    <Check className="check-icon" size={18} />
                    <div>
                      <strong>Day 1 Goal:</strong> Build a small component-based interface with reusable Header, Navigation, and Summary Cards.
                    </div>
                  </div>
                  <div className="checklist-item checklist-item--done">
                    <Check className="check-icon" size={18} />
                    <div>
                      <strong>Topics Verified:</strong> JSX syntax, Functional Components, Props passing, Local State, and Event handlers.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <Clock className="pending-icon" size={18} />
                    <div>
                      <strong>Day 2 Upcoming:</strong> React forms, validation, and API fetch state (useEffect).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 5. Controlled Modal for Adding Tasks */}
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddNewTask}
      />
    </div>
  );
}

export default App;

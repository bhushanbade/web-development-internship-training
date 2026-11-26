import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Layers, 
  Users, 
  Filter, 
  Check, 
  Clock, 
  Code2, 
  RotateCcw 
} from 'lucide-react';

// Subcomponents
import Sidebar from './components/Navigation/Sidebar';
import Header from './components/Header/Header';
import SummaryCard from './components/SummaryCard/SummaryCard';
import TaskList from './components/TaskList/TaskList';
import NewTaskModal from './components/Modal/NewTaskModal';
import Button from './components/Common/Button';
import Badge from './components/Common/Badge';
import Toast from './components/Common/Toast';

// API Service & Initial Data
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from './services/api';
import { initialStats, navigationItems } from './data/mockData';
import './App.css';

/**
 * App Component — PugArch OpsHub Controller (Day 2 Milestone).
 * 
 * Demonstrates:
 * 1. Controlled Forms & Field Validation (in NewTaskModal).
 * 2. Asynchronous State Management via useEffect:
 *    - Loading state (isLoading)
 *    - Error state (error & retry)
 *    - Empty state (handled when filtered data has length 0)
 *    - Success state (toast feedback notifications)
 * 3. Lifecycle Cleanup & Race Condition Mitigation:
 *    - AbortController signal passed to API
 *    - Effect cleanup aborting in-flight fetch on unmount / re-render
 * 4. Real-time debounced search & multi-criteria filtering.
 */
function App() {
  // 1. Navigation State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 2. Metrics Timeframe Filter
  const [filterPeriod, setFilterPeriod] = useState('today');

  // 3. Search & Multi-criteria Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // 4. API Asynchronous State (The 4 UI States)
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 5. Mentor Testing Controls State
  const [simulateApiError, setSimulateApiError] = useState(false);
  const [slowNetwork, setSlowNetwork] = useState(false);

  // 6. Modal & Toast Notifications
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // 7. Core useEffect: Asynchronous Data Synchronization with AbortController
  useEffect(() => {
    // Instantiate AbortController to cancel stale in-flight network requests
    const controller = new AbortController();

    // Debounce timer (280ms) to avoid firing requests on every single keystroke
    const debounceTimer = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      fetchTasks({
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        delayMs: slowNetwork ? 1500 : 500,
        simulateError: simulateApiError,
        signal: controller.signal
      })
        .then((res) => {
          setTasks(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          // If aborted by cleanup, ignore the rejection to prevent race condition state updates
          if (err.name === 'AbortError') {
            return;
          }
          setError(err);
          setIsLoading(false);
        });
    }, 280);

    // Cleanup Function: Executed before the next effect run or component unmount
    return () => {
      clearTimeout(debounceTimer);
      controller.abort(); // Cancel the HTTP request in transit
    };
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, slowNetwork, simulateApiError, refreshKey]);

  // Derived Metrics for KPI Summary Cards
  const completedCount = tasks.filter((t) => t.status?.toLowerCase() === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status?.toLowerCase() === 'in progress').length;
  const currentPeriodStats = initialStats[filterPeriod];

  // Action Handlers
  const handleRetry = useCallback(() => {
    setSimulateApiError(false); // Reset error simulation on manual retry
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  }, []);

  const handleToggleTaskStatus = async (taskId, newStatus) => {
    try {
      const updated = await updateTaskStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setToast({
        message: `Task status updated to "${newStatus}"!`,
        type: 'success'
      });
    } catch {
      setToast({
        message: 'Failed to update task status.',
        type: 'error'
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setToast({
        message: 'Task removed from sprint database.',
        type: 'info'
      });
    } catch {
      setToast({
        message: 'Failed to delete task.',
        type: 'error'
      });
    }
  };

  const handleAddNewTask = async (taskData, shouldSimulateServerError) => {
    const created = await createTask(taskData, {
      simulateError: shouldSimulateServerError
    });
    setTasks((prev) => [created, ...prev]);
    setToast({
      message: `Task "${created.title}" successfully created via API POST!`,
      type: 'success'
    });
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
              ? 'Executive Dashboard & API Explorer'
              : activeTab === 'tasks'
                ? 'Task & Sprint Management (Async View)'
                : activeTab === 'team'
                  ? 'Team Directory'
                  : activeTab === 'analytics'
                    ? 'Velocity & Performance'
                    : 'Settings & Environment'
          }
          pageSubtitle="PugArch Web Development Intern Capstone — Day 2: React Forms & API State"
          user={{ name: 'Bhushan Bade', role: 'Full Stack Intern', initials: 'BB' }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewTaskClick={() => setIsTaskModalOpen(true)}
          notificationCount={tasks.length}
        />

        {/* 3. Main Dashboard Content Area */}
        <main className="app-content">
          {/* Day 2 Concept Showcase Banner */}
          <section className="learning-banner">
            <div className="learning-banner__content">
              <div className="learning-banner__tag">
                <Code2 size={15} />
                <span>Day 2 Milestones Accomplished</span>
              </div>
              <h2 className="learning-banner__title">
                React Forms, Validation & Asynchronous API State
              </h2>
              <p className="learning-banner__desc">
                Integrated <code>useEffect</code> with <code>AbortController</code> lifecycle cleanup, 
                multi-criteria search filtering, controlled form validation, and all 4 essential UI states: 
                <strong> Loading (Skeletons)</strong>, <strong>Error (with Retry)</strong>, <strong>Empty (Search/No Data)</strong>, and <strong>Success (Toast Notifications)</strong>.
              </p>
            </div>
            <div className="learning-banner__badges">
              <Badge variant="info">useEffect & AbortSignal</Badge>
              <Badge variant="warning">Controlled Form & Touch</Badge>
              <Badge variant="success">4 UI States Integrated</Badge>
              <Badge variant="neutral">Debounced Search API</Badge>
            </div>
          </section>

          {/* Timeframe Filter Bar */}
          <section className="filter-toolbar">
            <div className="filter-toolbar__left">
              <span className="filter-toolbar__label">
                <Filter size={15} />
                <span>Summary Timeframe:</span>
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
                <span>
                  {isLoading ? 'Fetching API data...' : `API Sync Active • ${tasks.length} live records`}
                </span>
              </span>
            </div>
          </section>

          {/* 4. Reusable Summary Cards Grid */}
          <section className="summary-cards-grid">
            <SummaryCard
              title="Active API Tasks"
              value={filterPeriod === 'today' ? tasks.length : currentPeriodStats.totalTasks}
              change={currentPeriodStats.trends.totalTasks}
              changeType="positive"
              icon={CheckSquare}
              accentColor="#2563eb"
              trendLabel="retrieved from service"
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
              {/* Left Column: Searchable API Task List */}
              <div className="dashboard-grid__left">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Sprint Explorer & API Data View</h3>
                    <p className="section-subtitle">
                      Asynchronous list view demonstrating useEffect fetch, skeletons, and error retry
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      variant="secondary" 
                      size="small" 
                      icon={RotateCcw} 
                      onClick={handleRetry}
                      disabled={isLoading}
                    >
                      Refresh API
                    </Button>
                    <Button 
                      variant="primary" 
                      size="small" 
                      onClick={() => setIsTaskModalOpen(true)}
                    >
                      + Add Task
                    </Button>
                  </div>
                </div>

                <TaskList
                  tasks={tasks}
                  isLoading={isLoading}
                  error={error}
                  onRetry={handleRetry}
                  onToggleStatus={handleToggleTaskStatus}
                  onDeleteTask={handleDeleteTask}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  onResetFilters={handleResetFilters}
                  onOpenCreateModal={() => setIsTaskModalOpen(true)}
                  simulateError={simulateApiError}
                  onToggleSimulateError={setSimulateApiError}
                  slowNetwork={slowNetwork}
                  onToggleSlowNetwork={setSlowNetwork}
                />
              </div>

              {/* Right Column: Day 2 Concept Inspector & Architecture Card */}
              <aside className="dashboard-grid__right">
                {/* Async Lifecycle Inspector Panel */}
                <div className="panel-card">
                  <div className="panel-card__header">
                    <h4 className="panel-card__title">Day 2 Async Architecture</h4>
                    <Badge variant="info" size="small">useEffect Specs</Badge>
                  </div>
                  <div className="panel-card__body">
                    <pre className="tree-preview">
{`useEffect Flow & Cleanup:
┌───────────────────────────────┐
│ 1. Component Mount / Param 🔄 │
├───────────────────────────────┤
│ const ctrl = new Controller() │
│ setIsLoading(true)            │
│ setTimeout(debounceTimer, 280)│
├───────────────────────────────┤
│ 2. Fetch API with signal      │
│ fetchTasks({ signal: ctrl })  │
├───────────────────────────────┤
│ 3. Cleanup on Re-render/Unmt  │
│ clearTimeout(timer)           │
│ ctrl.abort() // Cancel stale! │
└───────────────────────────────┘`}
                    </pre>
                    <p className="tree-description">
                      The <strong>AbortController</strong> prevents stale race conditions when typing quickly. The 4 UI states (Loading, Error, Empty, Success) ensure robust user feedback.
                    </p>
                  </div>
                </div>

                {/* Team Quick Info Card */}
                <div className="panel-card">
                  <div className="panel-card__header">
                    <h4 className="panel-card__title">Team Directory</h4>
                    <span className="panel-card__meta">4 Active</span>
                  </div>
                  <ul className="team-roster">
                    <li className="team-roster__item">
                      <div className="team-roster__avatar">BB</div>
                      <div className="team-roster__info">
                        <span className="team-roster__name">Bhushan Bade</span>
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
                  <h3 className="section-title">All Project Tasks (API Data View)</h3>
                  <p className="section-subtitle">Real-time searchable list view with filtering and status controls</p>
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
                tasks={tasks}
                isLoading={isLoading}
                error={error}
                onRetry={handleRetry}
                onToggleStatus={handleToggleTaskStatus}
                onDeleteTask={handleDeleteTask}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onResetFilters={handleResetFilters}
                onOpenCreateModal={() => setIsTaskModalOpen(true)}
                simulateError={simulateApiError}
                onToggleSimulateError={setSimulateApiError}
                slowNetwork={slowNetwork}
                onToggleSlowNetwork={setSlowNetwork}
              />
            </div>
          )}

          {activeTab === 'team' && (
            <div className="tab-pane">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Engineering Team Directory</h3>
                  <p className="section-subtitle">Sprint contributors and module owners</p>
                </div>
              </div>
              <div className="team-grid">
                {[
                  { name: 'Bhushan Bade', role: 'Full Stack Intern', focus: 'React Forms, API State, useEffect', avatar: 'BB' },
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
                  <h4 className="panel-card__title">Sprint Performance Overview (Live API Metrics)</h4>
                  <Badge variant="success">98% On Track</Badge>
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
                  <h4 className="panel-card__title">Curriculum Progress Checklist</h4>
                </div>
                <div className="settings-checklist">
                  <div className="checklist-item checklist-item--done">
                    <Check className="check-icon" size={18} />
                    <div>
                      <strong>Day 1 Goal (Completed):</strong> React foundations, reusable Header, Navigation, and Summary Cards.
                    </div>
                  </div>
                  <div className="checklist-item checklist-item--done">
                    <Check className="check-icon" size={18} />
                    <div>
                      <strong>Day 2 Goal (Completed):</strong> Controlled forms, validation, useEffect cleanup with AbortController, and the 4 UI states (Loading, Error, Empty, Success).
                    </div>
                  </div>
                  <div className="checklist-item">
                    <Clock className="pending-icon" size={18} />
                    <div>
                      <strong>Day 3 Upcoming:</strong> TypeScript Essentials: primitive/union types, interfaces, typing props, and API response contracts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 5. Controlled Modal for Adding Tasks (POST simulation) */}
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddNewTask}
      />

      {/* 6. Success Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default App;

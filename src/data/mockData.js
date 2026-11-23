// Initial mock data for PugArch OpsHub Dashboard

export const initialStats = {
  today: {
    totalTasks: 24,
    completedTasks: 16,
    activeProjects: 5,
    teamAvailability: "92%",
    trends: {
      totalTasks: "+4 from yesterday",
      completedTasks: "+12% completion rate",
      activeProjects: "On schedule",
      teamAvailability: "2 members on leave"
    }
  },
  week: {
    totalTasks: 118,
    completedTasks: 89,
    activeProjects: 8,
    teamAvailability: "88%",
    trends: {
      totalTasks: "+18% vs last week",
      completedTasks: "+8% vs target",
      activeProjects: "+2 new sprints",
      teamAvailability: "Normal capacity"
    }
  },
  month: {
    totalTasks: 480,
    completedTasks: 412,
    activeProjects: 14,
    teamAvailability: "90%",
    trends: {
      totalTasks: "+24% QoQ",
      completedTasks: "86% average rate",
      activeProjects: "4 delivered",
      teamAvailability: "Full quarterly health"
    }
  }
};

export const initialTasks = [
  {
    id: 1,
    title: "Setup PostgreSQL database schema for authentication",
    category: "Backend",
    assignee: "Bhushan S.",
    priority: "High",
    status: "In Progress",
    dueDate: "Today, 5:00 PM"
  },
  {
    id: 2,
    title: "Design reusable SummaryCard and Navigation components",
    category: "Frontend",
    assignee: "Alex Rivera",
    priority: "Medium",
    status: "Completed",
    dueDate: "Today, 2:30 PM"
  },
  {
    id: 3,
    title: "Review Day 1 React component architecture with mentor",
    category: "Training",
    assignee: "Bhushan S.",
    priority: "High",
    status: "Pending",
    dueDate: "Today, 6:00 PM"
  },
  {
    id: 4,
    title: "Conduct API contract meeting for Express endpoints",
    category: "Architecture",
    assignee: "Sarah Chen",
    priority: "Low",
    status: "Completed",
    dueDate: "Yesterday"
  },
  {
    id: 5,
    title: "Configure Vite build pipelines and ESLint linting rules",
    category: "DevOps",
    assignee: "David Kim",
    priority: "Medium",
    status: "In Progress",
    dueDate: "Tomorrow, 11:00 AM"
  }
];

export const navigationItems = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard", badge: null },
  { id: "tasks", label: "Tasks & Sprints", icon: "CheckSquare", badge: "3" },
  { id: "team", label: "Team Members", icon: "Users", badge: null },
  { id: "analytics", label: "Performance", icon: "BarChart3", badge: null },
  { id: "settings", label: "Project Settings", icon: "Settings", badge: null }
];

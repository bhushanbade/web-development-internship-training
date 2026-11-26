/**
 * API Service for PugArch OpsHub — Day 2
 * 
 * Simulates a production REST API with:
 * 1. Asynchronous promises with realistic network latency.
 * 2. AbortSignal support (via AbortController) for useEffect cleanup and request cancellation.
 * 3. Search and multi-criteria filtering (status, priority, category).
 * 4. Error simulation toggles for testing Error UI states.
 * 5. Full CRUD operations (GET, POST, PATCH, DELETE).
 */

let tasksDatabase = [
  {
    id: 101,
    title: "Implement PostgreSQL relational schema with migrations",
    category: "Backend",
    assignee: "Bhushan Bade",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-11-28",
    description: "Design relational models, foreign keys, and indexes for tasks and user roles."
  },
  {
    id: 102,
    title: "Build controlled task form with real-time field validation",
    category: "Frontend",
    assignee: "Bhushan Bade",
    priority: "High",
    status: "Completed",
    dueDate: "2026-11-26",
    description: "Ensure touch tracking, error feedback, and disabled submit state when invalid."
  },
  {
    id: 103,
    title: "Integrate useEffect cleanup with AbortController for search API",
    category: "Architecture",
    assignee: "Alex Rivera",
    priority: "High",
    status: "Completed",
    dueDate: "2026-11-26",
    description: "Cancel in-flight HTTP requests when query changes rapidly to avoid race conditions."
  },
  {
    id: 104,
    title: "Design 4 essential async UI states: loading, error, empty, success",
    category: "Frontend",
    assignee: "Sarah Chen",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-11-27",
    description: "Implement animated skeleton loaders, error retry banner, and dismissible toasts."
  },
  {
    id: 105,
    title: "Set up Express REST routes with centralized error middleware",
    category: "Backend",
    assignee: "David Kim",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-11-29",
    description: "Establish standard response contracts and custom ApplicationError classes."
  },
  {
    id: 106,
    title: "Configure Next.js App Router hybrid layouts and server components",
    category: "Architecture",
    assignee: "Sarah Chen",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-12-02",
    description: "Investigate server-side rendering and streaming with Suspense."
  },
  {
    id: 107,
    title: "Write unit tests for form validation logic using React Testing Library",
    category: "Testing",
    assignee: "David Kim",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-12-04",
    description: "Verify error messages display when inputs are blurred with invalid data."
  },
  {
    id: 108,
    title: "Prepare Day 2 Mentor Defense presentation and architecture walkthrough",
    category: "Training",
    assignee: "Bhushan Bade",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-11-26",
    description: "Demonstrate deep understanding of useEffect lifecycle, cleanup, and controlled forms."
  }
];

/**
 * Fetch tasks with search, filters, pagination, and AbortSignal support.
 */
export async function fetchTasks({
  search = '',
  status = 'all',
  priority = 'all',
  category = 'all',
  delayMs = 600,
  simulateError = false,
  signal = null
} = {}) {
  return new Promise((resolve, reject) => {
    // Check if request was already aborted before starting
    if (signal?.aborted) {
      return reject(new DOMException('Request was aborted by the client', 'AbortError'));
    }

    const timer = setTimeout(() => {
      // Simulate server error if requested
      if (simulateError) {
        return reject(new Error('HTTP 500: Internal Server Error. The tasks microservice failed to respond.'));
      }

      // Filter tasks in memory
      let result = [...tasksDatabase];

      if (search.trim()) {
        const query = search.trim().toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.assignee.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query)
        );
      }

      if (status !== 'all') {
        result = result.filter((t) => t.status.toLowerCase() === status.toLowerCase());
      }

      if (priority !== 'all') {
        result = result.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
      }

      if (category !== 'all') {
        result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
      }

      resolve({
        data: result,
        total: result.length,
        timestamp: new Date().toISOString()
      });
    }, delayMs);

    // Attach abort listener for useEffect cleanup
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Request was aborted by the client', 'AbortError'));
      });
    }
  });
}

/**
 * Create a new task (POST /api/tasks simulation).
 */
export async function createTask(taskData, { delayMs = 700, simulateError = false, signal = null } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Request aborted', 'AbortError'));
    }

    const timer = setTimeout(() => {
      if (simulateError) {
        return reject(new Error('HTTP 422: Unprocessable Entity. Server-side validation rejected the payload.'));
      }

      const newTask = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      tasksDatabase = [newTask, ...tasksDatabase];
      resolve(newTask);
    }, delayMs);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Request aborted', 'AbortError'));
      });
    }
  });
}

/**
 * Update task status (PATCH /api/tasks/:id simulation).
 */
export async function updateTaskStatus(taskId, newStatus, { delayMs = 400 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = tasksDatabase.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) {
        return reject(new Error('Task not found'));
      }

      tasksDatabase[taskIndex] = {
        ...tasksDatabase[taskIndex],
        status: newStatus
      };

      resolve(tasksDatabase[taskIndex]);
    }, delayMs);
  });
}

/**
 * Delete a task (DELETE /api/tasks/:id simulation).
 */
export async function deleteTask(taskId, { delayMs = 400 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      tasksDatabase = tasksDatabase.filter((t) => t.id !== taskId);
      resolve({ success: true, id: taskId });
    }, delayMs);
  });
}

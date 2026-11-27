# PugArch Web Development Training — 20-Day Intern Program

20-day hands-on web development training covering modern frontend (React, TypeScript, Next.js, Angular), backend (Node.js/Express, Laravel), databases (PostgreSQL), and full-stack capstone projects.

---

## 📌 Progress Status

- ✅ **Day 1: React Foundations & Component Thinking** (Completed — Reusable components, props, state, events, and component tree sketch)
- ✅ **Day 2: React Forms and API State** (Completed — Controlled forms, validation, `useEffect`, `AbortController`, and the 4 UI states: Loading, Error, Empty, Success)
- ⏳ **Day 3: TypeScript Essentials** (Upcoming — Converting components, props, events, and API response contracts to TypeScript)

---

## 🛠️ Project Structure

```text
web_development_training/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Brand logos & graphics
│   ├── components/
│   │   ├── Common/         # Atomic UI primitives
│   │   │   ├── Badge.jsx          # Reusable status & priority badge
│   │   │   ├── Button.jsx         # Reusable design-system button
│   │   │   ├── EmptyState.jsx     # Dedicated empty search/data state
│   │   │   ├── ErrorAlert.jsx     # Error state alert with retry trigger
│   │   │   ├── Skeleton.jsx       # Shimmer loading skeleton rows
│   │   │   └── Toast.jsx          # Success state auto-dismissing notifications
│   │   ├── Header/         # Reusable Header component & styles
│   │   ├── Modal/          # Advanced Controlled NewTaskModal with touch validation
│   │   ├── Navigation/     # Reusable Sidebar navigation component
│   │   ├── SummaryCard/    # Reusable KPI SummaryCard component
│   │   └── TaskList/       # Searchable list view with loading/error/empty states
│   ├── services/
│   │   └── api.js          # Asynchronous API service with AbortSignal & latency simulation
│   ├── data/
│   │   └── mockData.js     # Initial metrics and navigation structure
│   ├── App.jsx             # Dashboard controller & useEffect orchestrator
│   ├── App.css             # Dashboard layout & theme styling
│   ├── index.css           # Global reset and typography
│   └── main.jsx            # Application entry point
├── DAY1_COMPONENT_TREE.md  # Official Day 1 Component Tree Sketch
├── vercel.json             # Vercel deployment configuration
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Verify Code Quality & Build
```bash
# Run linter (0 errors, 0 warnings)
npm run lint

# Build for production (< 700ms)
npm run build
```

---

## 📚 End-of-Day Submissions & Architecture

- **Day 1 Component Tree Sketch:** [DAY1_COMPONENT_TREE.md](file:///d:/PugArch/web_development_training/DAY1_COMPONENT_TREE.md) — Visual component hierarchy, props & data flow matrix required by Day 1 curriculum.

---

## 📋 Daily Working Agreement Log

### Day 1 Summary:
- **What works:**
  - Full React component hierarchy built and rendered cleanly.
  - Active tab navigation (Overview, Tasks, Team, Analytics, Settings).
  - Timeframe filter (Today, Week, Month) dynamically updates summary metrics.
  - Live task search filtering by title, assignee, category, and priority.
  - Task status toggle updates summary counts reactively.
  - Controlled New Task Modal adds new items to state with validation.
  - Zero linter warnings, zero errors. Production build verified.

### Day 2 Summary:
- **What works:**
  - Searchable list view with real-time debounced query input.
  - Multi-criteria filtering by Status, Priority, and Category.
  - Core `useEffect` hook with `AbortController` preventing race conditions during fast typing.
  - The 4 essential UI states:
    1. *Loading:* Skeleton placeholder rows with shimmer animations.
    2. *Error:* Actionable HTTP 500 alert box with instant "Retry Request" action.
    3. *Empty:* Contextual empty state with "Reset Filters" action.
    4. *Success:* Real-time data grid updates and auto-dismissing toast notifications.
  - Controlled New Task Modal with touch tracking (`onBlur`) and multi-field validation.
  - Mentor testing toolbar with toggles for slow network simulation and API error simulation.
  - 0 linter warnings, 0 errors. Clean production build in 684ms.
- **What was difficult:**
  - Handling race conditions and cleanup with `AbortController` in `useEffect` so that aborted requests do not update component state or log uncaught errors.
- **Next Step (Day 3):**
  - TypeScript Essentials: Converting all components, props, event handlers, and API response models to TypeScript.

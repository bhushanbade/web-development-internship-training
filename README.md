# PugArch Web Development Training — 20-Day Intern Program

20-day hands-on web development training covering modern frontend (React, TypeScript, Next.js, Angular), backend (Node.js/Express, Laravel), databases (PostgreSQL), and full-stack capstone projects.

---

## 📌 Day 1 Status: React Foundations & Component Thinking

### Learning Outcome
Build a small component-based dashboard interface demonstrating:
- JSX and functional components
- Props, state, and event handling
- Component composition and clean naming conventions

### Hands-on Deliverable
**PugArch OpsHub — Task & Team Management Dashboard**
- Reusable **Header** with search bar, notification badge, and user profile capsule (**Bhushan Bade**).
- Reusable **Navigation Sidebar** with tab navigation, collapse/expand toggle, and status indicators.
- Reusable **Summary Cards** displaying key metrics, trend rates, and icons with timeframe filtering (Today / Week / Month).
- Interactive **Task Management Table** with status toggling, category & priority badges, and item deletion.
- Controlled **New Task Modal** with form validation and dynamic state lifting.

---

## 🛠️ Project Structure

```text
web_development_training/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Brand logos & graphics
│   ├── components/
│   │   ├── Common/         # Atomic UI primitives (Button, Badge)
│   │   ├── Header/         # Reusable Header component & styles
│   │   ├── Modal/          # Controlled NewTaskModal dialog
│   │   ├── Navigation/     # Reusable Sidebar navigation component
│   │   ├── SummaryCard/    # Reusable KPI SummaryCard component
│   │   └── TaskList/       # Task table, status toggles, empty state
│   ├── data/
│   │   └── mockData.js     # Initial mock statistics, tasks, nav items
│   ├── App.jsx             # Main dashboard controller & state manager
│   ├── App.css             # Dashboard layout & theme styling
│   ├── index.css           # Global reset and typography
│   └── main.jsx            # Application entry point
├── DAY1_COMPONENT_TREE.md  # Official Day 1 Component Tree Sketch
├── DAY1_MENTOR_WALKTHROUGH.md # Step-by-step mentor explanation & Q&A guide
├── Day1_React_Foundations_and_Architecture_Guide.pdf # 6-Page Architectural Publication
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
# Run linter
npm run lint

# Build for production
npm run build
```

---

## 📚 End-of-Day Submissions & Mentor Review Materials

- **Component Tree Sketch:** See [DAY1_COMPONENT_TREE.md](file:///d:/PugArch/web_development_training/DAY1_COMPONENT_TREE.md) for the Mermaid diagram, ASCII hierarchy, and props/state table.
- **Mentor Defense Guide:** See [DAY1_MENTOR_WALKTHROUGH.md](file:///d:/PugArch/web_development_training/DAY1_MENTOR_WALKTHROUGH.md) for conceptual explanations, architectural decisions, and anticipated mentor questions with ready answers.
- **Comprehensive Theory PDF:** See [Day1_React_Foundations_and_Architecture_Guide.pdf](file:///d:/PugArch/web_development_training/Day1_React_Foundations_and_Architecture_Guide.pdf) for the 6-page printable report.

---

## 📋 Daily Working Agreement Log

- **What works:**
  - Full React component hierarchy built and rendered cleanly.
  - Active tab navigation (Overview, Tasks, Team, Analytics, Settings).
  - Timeframe filter (Today, Week, Month) dynamically updates summary metrics.
  - Live task search filtering by title, assignee, category, and priority.
  - Task status toggle (Completed / In Progress) updates summary counts reactively.
  - Controlled New Task Modal adds new items to state with validation.
  - Zero linter warnings, zero errors. Production build verified.
- **What was difficult:**
  - Deciding the cleanest state lifting architecture so summary cards, search filter, and task table stay synchronized without prop drilling across unrelated branches.
- **Next Step (Day 2):**
  - React forms and API state: controlled forms, input validation, loading/error/empty/success states, and `useEffect` data fetching.

Of course. Based on the detailed assignment instructions and our extensive discussions building out the core logic, here is a comprehensive `README.md` file for your TalentFlow project.

This document is structured to meet all the evaluation criteria, highlighting the technical decisions, architecture, and features we've implemented.

-----

# TalentFlow

> A lightweight, front-end-only hiring platform for managing jobs, candidates, and assessments. Built with modern React, this project simulates a complete hiring workflow without a backend, using local persistence to maintain state.

**[Live Demo Link]** 

-----

## ✨ Key Features

  * **Jobs Board:** Create, edit, archive, and reorder job postings with server-like pagination, filtering, and optimistic updates for a seamless UX.
  * **Candidate Kanban:** Manage candidates through a drag-and-drop Kanban board, progressing them through stages from "Applied" to "Hired".
  * **Virtualized Candidate List:** Efficiently browse and search over 1,000+ candidates with a virtualized list, ensuring high performance.
  * **Dynamic Assessment Builder:** Construct custom, job-specific assessments with multiple sections and question types (text, numeric, choice, file upload).
  * **Interactive Assessment Runtime:** A candidate-facing form with a carousel layout, conditional question logic, and per-question validation.
  * **Local-First Persistence:** All data is persisted in the browser using IndexedDB (via Dexie.js), ensuring state is restored on page refresh.
  * **Realistic API Simulation:** A mock API layer built with Mock Service Worker (MSW) simulates network latency and a 10% error rate on write operations to test resilience.

-----

## 🛠️ Tech Stack

  * **Framework:** React (Vite) & TypeScript
  * **State Management:** TanStack Query (React Query) for server state, caching, and mutations.
  * **"API" Layer:** Mock Service Worker (MSW) to simulate a REST API.
  * **Local Database:** Dexie.js (a wrapper for IndexedDB) for persistent client-side storage.
  * **UI:** Tailwind CSS with Shadcn/ui for accessible, pre-built components.
  * **Routing:** React Router
  * **Drag & Drop:** dnd-kit (for Jobs reordering and Kanban board).
  * **Virtualization:** TanStack Virtual (for the high-performance candidate list).
  * **Forms:** Built with controlled components and custom validation logic.

-----

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

  * Node.js (v18 or later)
  * `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Gauhar-1/TalentFlow.git
    cd talentflow
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`. MSW will intercept API calls, and Dexie will create the IndexedDB database on the first load.

-----

## 🏛️ Architecture & Technical Decisions

This project is architected with a "local-first" philosophy, treating the browser as the primary data store and the mock API as a network simulation layer.

### 1\. State Management: TanStack Query

The application's "server state" (jobs, candidates, etc.) is managed exclusively by **TanStack Query**. This choice was made for several reasons:

  * **Declarative Data Fetching:** It simplifies fetching, caching, and updating data from our mock API without manual `useEffect` hooks.
  * **Caching & Invalidation:** TanStack Query’s caching automatically improves performance. After a mutation (e.g., creating a job, submitting an assessment), we use `queryClient.invalidateQueries` to intelligently refetch stale data, keeping the UI in sync.
  * **Optimistic Updates:** For features like reordering jobs, we use optimistic updates to provide an instant UI response. The UI is updated immediately, and if the (simulated) API call fails, TanStack Query automatically rolls back the change.

### 2\. "API" Layer: Mock Service Worker (MSW)

MSW intercepts actual network requests at the service worker level. This is a crucial decision because it allows the application code (e.g., `fetch` calls, React Query hooks) to be written as if it's communicating with a real backend.

  * **Realistic Simulation:** All write endpoints have an artificial latency of 200-1200ms and a 10% chance of returning a 500 error to test loading states, error boundaries, and optimistic update rollbacks.
  * **Single Source of Truth:** MSW does not hold its own state. It acts as a "write-through" layer, forwarding all create, update, and delete operations to the Dexie (IndexedDB) database. This ensures data persistence and consistency.

### 3\. Local Persistence: Dexie.js (IndexedDB)

All application data is stored in the browser's **IndexedDB**. Dexie.js was chosen as a minimalist, powerful wrapper to simplify database interactions.

  * **Data Model:** We established a clear, relational data model with tables for `jobs`, `candidates`, `assessments`, `timeline`, and `assessmentSubmissions`.
  * **Persistence on Refresh:** On application startup, data is seeded into IndexedDB. On subsequent visits, the app's state is fully restored from the database, providing a seamless user experience.

### 4\. Component Architecture

The UI is built using **Shadcn/ui**, which provides unstyled, accessible core components. This allows for rapid development while maintaining full control over styling with Tailwind CSS. The `AssessmentRuntime` component is a prime example of a complex, stateful component that manages a controlled carousel, dynamic question rendering, and per-question validation logic.

-----

## 🤔 Challenges & Future Improvements

### Challenges Encountered

  * **Optimistic UI for Drag-and-Drop:** Implementing the `onMutate` and `onError` logic in TanStack Query for the job reordering feature was complex. Ensuring the UI correctly rolls back to its original state upon a simulated API failure required careful state management.
  * **Controlled Carousel Validation:** Making the "Next" button in the assessment dependent on the current question's validation required controlling the `Carousel` component's state via its API and managing a separate `canGoNext` state.
  * **Linking External Buttons to Forms:** A layout challenge in the assessment UI required the submit button to be in a `<CardFooter>` outside the `<form>` element. This was solved cleanly using the HTML5 `form="form-id"` attribute, a declarative solution superior to using `useRef` to trigger submission programmatically.

### Future Improvements

  * **Real-time Collaboration:** Integrate a WebSocket-based service (like a mock PartyKit server) to allow for real-time updates (e.g., seeing a candidate's stage change instantly for all users).
  * **Authentication & User Roles:** Add a mock authentication flow to distinguish between HR users and candidates.
  * **Full Backend Integration:** The use of MSW means the application is ready to be connected to a real backend with minimal changes to the data-fetching logic.
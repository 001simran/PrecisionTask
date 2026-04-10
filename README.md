# Task Manager Application - Candidate Submission

This is a clean, modular, and professional Task Manager application built as part of a full-stack assessment. The project focus is on **Clarity, Correctness, and Clean Architecture.**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup & Run
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

3. **Run Automated Tests**:
   ```bash
   npm run test:api
   ```

## 🏗️ Architecture & Organization

The project follows a **strict modular structure** to demonstrate separation of concerns and maintainability:

- **`src/backend/`**: Contains pure logic, Mongoose models, and database utilities.
- **`src/frontend/`**: Contains reusable UI components and client-side logic.
- **`src/app/`**: Next.js App Router orchestration, global styles, and REST API routes.

## ⚙️ Persistence (The Hybrid Approach)
To ensure the application is **fully portable and runnable** for the evaluation team without the need for a local MongoDB setup:
- The app uses a **Fail-Safe Persistence Layer**.
- It attempts to connect to MongoDB as the primary store.
- **Automatic Fallback**: If MongoDB is unavailable, it seamlessly switches to **Local File Storage** (`data/tasks.json`).
- This ensures a perfect "zero-config" experience for the recruiter.

## ✨ Implemented Requirements
- [x] **Full CRUD**: Create, View, Update Status, and Delete tasks.
- [x] **API Integration**: Robust Next.js API routes with JSON responses.
- [x] **Validation**: Title presence check and status validation.
- [x] **Feedback**: Optimistic UI updates (instant response) + Toast notifications.
- [x] **Filtering**: All / Active / Completed views.
- [x] **Persistence**: MongoDB + JSON Fallback.
- [x] **Automated Tests**: Custom logic verification suite included.

## 📝 Trade-offs & Assumptions
- **Next.js API Routing**: I chose Next.js API routes (located in `/api/tasks`) as they are the industry standard for modern full-stack React applications, providing high performance and ease of deployment.
- **Optimistic UI**: I prioritized a snappy user experience where tasks update instantly on the screen while the network request processes in the background.
- **Portability**: I assumed the evaluator might want to run the project without a database, so I prioritized the JSON fallback mechanism.

---
*Built with React 19, Next.js 15, TypeScript, MongoDB, and Tailwind CSS.*

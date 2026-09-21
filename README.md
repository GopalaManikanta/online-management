# 🎓 EduSync - Online Learning Management System

EduSync is a modern, full-featured **Online Learning Management System (LMS)** built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **Lucide Icons**. It provides seamless, real-time learning management workflows for Admins, Faculty Instructors, and Students.

---

## 🌟 Key Features

### 👤 1. Authentication & Session Management (`/login`, `/register`, `/forgot-password`)
- Role-based authentication (Admin, Student, Faculty).
- Dynamic local storage session management with instant logout/redirect.
- Clean password reset and registration flows.

### 📊 2. Admin Dashboard & KPI Metrics (`/dashboard`)
- Live real-time statistics: Total Courses, Total Students, Total Instructors, Enrolled Courses, Completed Courses.
- Quick Actions modal for adding new course modules.
- Live Feed for system activities, student registrations, and instructor directories.

### 🎥 3. Live Classes & Upcoming Sessions (`Dashboard` & `StudentPortal`)
- Real-time scheduled live sessions with `Live Now` and `Upcoming` status badges.
- Dynamic session scheduler for Admin and Faculty.
- In-app interactive UI presentation for live class streaming.

### 🎓 4. Student Learning Portal (`/student-portal`)
- **4-Step Sequential Learning Progression**:
  1. **Step 1**: Interactive Video Lessons Progress (100% completion required).
  2. **Step 2**: Practical Assignment Submission.
  3. **Step 3**: Timed Interactive Quiz Assessment ($\ge 70\%$ pass requirement).
  4. **Step 4**: Real-time Verification & Certificate Generation.
- Self-enrollment catalog with instant course discovery and progress tracking.

### 📋 5. Assignments & Quizzes Management (`/assignments`)
- Course filter dropdowns and status badges (`Pending`, `Submitted`, `Graded`, `Available`, `Passed`).
- **Student Assignment Submissions Roster**: Dynamic student lookup with embedded **Solution Key** modal showing model answers and student selections.

### 📈 6. Reports & Analytics (`/reports`)
- Comprehensive interactive charts: Monthly Enrollments Trend (Jan - Dec), Course Category Donut Distribution.
- One-click **Export & Print Report** summary.

---

## 📁 Project Architecture & Clean Folder Structure

```
D:/Online/
├── public/                  # Static assets (Favicon, SVG icons)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # EmptyState, ErrorBoundary, LoadingSpinner, Modal, SkeletonLoader
│   │   ├── layout/          # DashboardLayout, Navbar, Sidebar
│   │   └── ProtectedRoute.jsx
│   ├── context/             # Global Context Providers (AuthContext, LMSContext)
│   ├── pages/               # Route pages
│   │   ├── assignments/    # Assignments & Quizzes Roster
│   │   ├── auth/           # Login, Register, ForgotPassword
│   │   ├── courses/        # Course Catalog & Management
│   │   ├── dashboard/      # Admin KPI Dashboard
│   │   ├── enrollments/    # Enrollment Directory
│   │   ├── instructors/    # Faculty Directory
│   │   ├── progress/       # Student Progress Tracking
│   │   ├── reports/        # Reports & Analytics
│   │   └── students/       # Student Directory & Learning Portal
│   ├── services/            # API integration & initial data seed
│   ├── App.jsx              # Main router & provider setup
│   ├── index.css            # Tailwind CSS v4 styles
│   └── main.jsx             # React DOM root entry
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Lint Codebase
```bash
npm run lint
```

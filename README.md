# Smart Student Hub - Project Overview

Welcome to the Smart Student Hub! This document provides a comprehensive A-to-Z overview of the application, its features, technical architecture, and key functionalities.

## 1. Application Purpose

The **Smart Student Hub** is a web application designed to bridge the gap between students and educational institutions. It provides a centralized platform for students to log, verify, and showcase their extracurricular activities and achievements. For institutions, it offers powerful tools to manage approvals, track student engagement, and generate data for accreditation and reporting.

---

## 2. User Roles & Key Features

The application supports two main user roles: **Student** and **Admin**.

### For Students (`/student`)

- **Dashboard:** A personalized welcome screen with at-a-glance statistics (total activities, pending, approved) and a list of recent activity submissions.
- **My Activities:** A comprehensive log to view all submitted activities. Students can filter by status (Approved, Pending, Rejected) and can edit and resubmit rejected entries.
- **Add Activity:** A modal form to log new activities, including details like title, category, date, description, and mock proof upload.
- **AI Suggestions:** An AI-powered feature that suggests relevant extracurricular activities based on the student's profile to help them enhance their portfolio.
- **Verified Portfolio:** A dynamic, editable, and shareable digital portfolio. Students can update their personal information, skills, and see all their verified achievements in one place. They can also download it as a PDF or copy a public link.
- **Leaderboard:** A view of the institutional leaderboard, showing how they rank against their peers based on the number of approved activities.
- **Activity Timeline:** A chronological, visual representation of their entire journey, showing all activities and their statuses over time.

### For Administrators (`/admin`)

- **Dashboard:** A central hub showing key institutional metrics like total students, pending approvals, and total logged activities. It also includes a preview of the approval queue.
- **Approval Queue:** A dedicated page to review, approve, or reject student-submitted activities.
- **Student Leaderboard:** A view of the overall student rankings, with the ability to navigate directly to any student's portfolio.
- **Student Portfolio View:** A read-only view of a student's complete professional portfolio, including their profile details and all verified activities. Admins can also download this portfolio as a PDF.
- **Institutional Analytics:** A powerful analytics page featuring:
  - **Activity Breakdown:** A pie chart showing the distribution of verified activities by category.
  - **Submission Trends:** A line chart tracking activity submissions over time.
  - **Department Performance:** A bar chart ranking academic departments by activity volume.
  - **Report Generation:** Tools to export all verified activity data into a formatted Excel (.xlsx) file for accreditation (NAAC, NIRF) and internal reporting.

---

## 3. Technical Stack

The application is built with a modern, robust, and scalable tech stack:

-   **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **UI Library:** [React](https://reactjs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
-   **Generative AI:** [Google's Genkit](https://firebase.google.com/docs/genkit)
-   **Charts & Graphs:** [Recharts](https://recharts.org/)
-   **Form Management:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
-   **File Generation:** `jspdf` and `html2canvas` for PDF creation; `xlsx` for Excel file generation.

---

## 4. Project Structure

The project is organized into several key directories within the `src/` folder:

-   **`src/app/`**: Contains all the routes for the application, following the Next.js App Router convention.
    -   `app/(main)`: Routes for public-facing pages (Home, Login, Signup).
    -   `app/student/`: Routes and pages for the student dashboard.
    -   `app/admin/`: Routes and pages for the admin panel.
    -   `app/layout.tsx`: The root layout for the entire application.
    -   `app/globals.css`: Global styles and ShadCN theme variables.
-   **`src/components/`**: Contains all reusable React components.
    -   `components/shared/`: Components used by both Admins and Students (e.g., `StatCard`, `StatusBadge`, `Sidebar`).
    -   `components/student/`: Components specific to the student experience (e.g., `AddActivityModal`).
    -   `components/landing/`: Components for the main landing page.
    -   `components/ui/`: Auto-generated ShadCN UI components (Button, Card, etc.).
-   **`src/context/`**: Houses React Context providers for global state management.
    -   `AuthContext.tsx`: Manages user authentication state (mocked).
    -   `ActivityContext.tsx`: Manages the state for all student activities (mocked).
-   **`src/ai/`**: Contains all the Generative AI logic using Genkit.
    -   `ai/genkit.ts`: Initializes and configures the Genkit `ai` object.
    -   `ai/flows/`: Contains Genkit "flows," which are the server-side functions that interact with AI models.
-   **`src/lib/`**: A library of utility functions, mock data, and other helper modules.
    -   `lib/mock-data.ts`: Provides all the initial data for users and activities, simulating a database.
    -   `lib/utils.ts`: General utility functions, like `cn` for merging CSS classes.

---

## 5. Data Management & State

-   **Data Source:** The application currently runs on **mock data** defined in `src/lib/mock-data.ts`. This allows for rapid prototyping without needing a database setup. All users and activities are sourced from this file.
-   **State Management:** Global state is managed using **React Context**.
    -   **`AuthContext`** holds the currently logged-in user and handles login/logout logic.
    -   **`ActivityContext`** holds the list of all activities and provides functions to add, update, and retrieve them.
-   **Session Persistence:** The logged-in user's state is persisted across browser sessions using `sessionStorage` in the `AuthContext`, providing a smooth user experience.

This setup makes the application self-contained and easy to run, while being architected for a future transition to a real database and authentication service like Firebase.

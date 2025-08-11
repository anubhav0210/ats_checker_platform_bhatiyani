# prompts.md

This file documents the AI prompts used during the development of the **ATS_Checker_Platform** project, which includes:
- Frontend (React + MUI + Chart.js)
- Backend (FastAPI + MongoDB)
- JSON Server (for mock/static data)
- Authentication & Resume ATS Scoring System

---

## 1. User Authentication (Register & Login)
**Prompt:**  
"Create FastAPI endpoints for user registration and login with JWT authentication and MongoDB integration."  
**Purpose:**  
To implement secure signup/login flow with hashed passwords and token-based authentication.

---

## 2. Protected Routes
**Prompt:**  
"Write a React ProtectedRoute component that checks JWT from localStorage and redirects unauthenticated users."  
**Purpose:**  
Ensure that only authenticated users can access dashboard and resume-related pages.

---

## 3. JWT Token Verification in Backend
**Prompt:**  
"Write a FastAPI dependency to validate JWT token, extract user_id, and block unauthorized requests."  
**Purpose:**  
Backend-level route protection.

---

## 4. Resume Upload Feature
**Prompt:**  
"Write a FastAPI endpoint to accept resume file uploads and store metadata in MongoDB."  
**Purpose:**  
Enable file uploads and link resumes to authenticated users.

---

## 5. ATS Score Calculation
**Prompt:**  
"Generate Python code in FastAPI to calculate an ATS score for uploaded resumes and store it with the file metadata."  
**Purpose:**  
Provide job-matching insights to users.

---

## 6. Resume Retrieval per User
**Prompt:**  
"Create FastAPI endpoint to return only the resumes that belong to the authenticated user."  
**Purpose:**  
Ensure users see only their own data.

---

## 7. Dashboard Resume List
**Prompt:**  
"Write a React component to fetch and display authenticated user resumes in a table with ATS score and upload date."  
**Purpose:**  
Visual representation of stored resumes.

---

## 8. Resume Preview Feature
**Prompt:**  
"Write a React page to preview a selected resume in-browser using a PDF viewer library."  
**Purpose:**  
Allow users to view their uploaded resumes without downloading.

---

## 9. Resume Delete Feature
**Prompt:**  
"Write a FastAPI endpoint to delete a resume by ID, only if it belongs to the authenticated user."  
**Purpose:**  
Secure file removal.

---

## 10. Resume Update Feature
**Prompt:**  
"Create FastAPI + React integration to allow replacing an existing resume file while keeping the same database record."  
**Purpose:**  
Enable resume version updates.

---

## 11. JSON Server Integration
**Prompt:**  
"Set up a JSON Server to provide mock job listings and integrate them with the frontend using Axios."  
**Purpose:**  
Simulate job listing functionality without requiring a live API.

---

## 12. Job Listing Page
**Prompt:**  
"Create a React component to fetch and display job listings from JSON Server with search and filter options."  
**Purpose:**  
Provide users with relevant job information.

---

## 13. Chart.js Dashboard Analytics
**Prompt:**  
"Implement Chart.js in React to display ATS score distribution for the user’s uploaded resumes."  
**Purpose:**  
Provide visual analytics.

---

## 14. Navbar with Auth State
**Prompt:**  
"Write a React MUI Navbar that shows Login/Register when not authenticated and Profile/Dashboard when authenticated."  
**Purpose:**  
Dynamic navigation experience.

---

## 15. Deployment Setup
**Prompt:**  
"Give step-by-step commands to deploy React frontend, FastAPI backend, and MongoDB on Render.com for free."  
**Purpose:**  
Guide deployment and hosting process.

---

**Note:** All the above prompts were tested, refined, and integrated into the codebase using ChatGPT as the AI assistant. Copilot was used for minor inline code suggestions and auto-completions in both frontend and backend files.

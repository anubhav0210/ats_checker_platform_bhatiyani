# Resume ATS Checker Platform

A scalable, full-stack Applicant Tracking System (ATS) Resume Checker platform designed to help users upload, parse, and score resumes intelligently. Built with React for the frontend and FastAPI for the backend, this platform supports PDF resume parsing, keyword-based scoring logic, and secure user authentication.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Authentication](#authentication)  
- [Contributing](#contributing)  
- [Contact](#contact)  

---

## Project Overview

The Resume ATS Checker platform is designed to simplify the recruitment process by providing a robust, user-friendly system that analyzes resumes uploaded by candidates and scores them against job criteria. It consists of:

- **React frontend**: Responsive UI with dashboard, resume upload and preview, scoring visualization.
- **FastAPI backend**: Handles PDF parsing, scoring algorithms, authentication, and CRUD operations with MongoDB.
- **JWT Authentication**: Secure login and registration.
- **MongoDB**: Stores user data, resume metadata, and scores.

---

## Features

- Upload and preview PDF resumes
- Intelligent keyword-based resume scoring
- Candidate dashboard to track resume submissions and scores
- User registration and login with JWT-based authentication
- Responsive design supporting desktop and mobile
- CRUD operations for user profiles and resumes

---

## Tech Stack

- **Frontend:** React, Material-UI (MUI), Chart.js (for data visualization)
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **PDF Parsing:** Python libraries (e.g., PyPDF2 or pdfplumber ,others is mentioned in requirements.txt)

---

## Installation

### Prerequisites

- FastApi
- Python 3.8+
- MongoDB instance running locally or remotely
- `pip` for Python package installation

### Setup Frontend

```bash
cd frontend
npm install
npm start
```

### Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Usage

1. Start the backend server (`http://localhost:8000`).
2. Start the React frontend (`http://localhost:3000`).
3. Register a new user or log in.
4. Upload a resume PDF via the dashboard.
5. View parsed resume data and scoring results.
6. Manage user profile and resume submissions.

---

## API Endpoints

- `POST /auth/register` - Register new user  
- `POST /auth/login` - Login user and receive JWT  
- `POST /resumes/upload` - Upload and parse PDF resume  
- `GET /resumes` - Get list of uploaded resumes for the user  
- `GET /resumes/{id}` - Get details of a specific resume  
- `DELETE /resumes/{id}` - Delete a resume  

---

## Authentication

Uses JWT tokens to secure API endpoints. Include the JWT token in the `Authorization` header as:

```
Authorization: Bearer <token>
```

---


## Contact

For any questions or feedback, please contact:

- Name - singhkrishna6052@gmail.com 
- GitHub: [anubhav0210](https://http://github.com/anubhav0210)  
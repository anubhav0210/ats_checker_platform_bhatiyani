# Resume ATS Checker Platform

![Project Banner](https://i.imgur.com/J5q8S5l.png) *Replace with your actual banner image*

A full-stack platform for analyzing resume compatibility with Applicant Tracking Systems (ATS), featuring real/mock backend switching.

## Table of Contents
- [Features](#features)
- [Dual Backend Architecture](#dual-backend-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Mock Data System](#mock-data-system)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **PDF Resume Analysis**
  - ATS compatibility scoring
  - Keyword matching
  - Format evaluation

- **User Management**
  - JWT authentication
  - Resume history tracking
  - Profile management

- **Development Flexibility**
  - Real FastAPI backend
  - Mock JSON server
  - Hot-swappable backends

## 🏗️ Dual Backend Architecture
```
src/
  api/
    index.js          # API gateway
    realBackend.js    # Production API
    mockBackend.js    # Mock API
  mocks/
    db.json           # Mock data
```

**Switching Mechanism**:
```javascript
// api/index.js
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';
export const api = USE_MOCK ? mockBackend : realBackend;
```

## 🛠️ Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- Git

### Steps
```bash
# Clone repository
git clone https://github.com/yourusername/resume-ats-checker.git
cd resume-ats-checker

# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## ⚙️ Configuration

Create `.env` files:

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_USE_MOCK=false
```

**backend/.env**
```env
MONGO_URI=mongodb://localhost:27017/ats_checker
SECRET_KEY=your-secret-key
```

## 🚀 Running the Application

### Production Mode
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start
```

### Mock Mode
```bash
# Terminal 1 - Mock server
cd frontend
npm run mock:server

# Terminal 2 - Frontend with mock data
npm run start:mocked
```

## 📚 API Documentation

### Real Endpoints (FastAPI)
| Endpoint         | Method | Description         |
|------------------|--------|---------------------|
| /auth/register   | POST   | User registration   |
| /auth/login      | POST   | User login          |
| /api/resumes     | POST   | Upload resume       |
| /api/resumes     | GET    | List resumes        |

### Mock Endpoints (JSON Server)
```
http://localhost:3001/resumes
http://localhost:3001/users
```

## 🧪 Mock Data System

### Sample db.json
```json
{
  "resumes": [
    {
      "id": "1",
      "user_id": "1",
      "score": 78,
      "keywords": ["React", "Node.js"]
    }
  ]
}
```

**Customizing Mocks**:
- Edit `frontend/src/mocks/db.json`
- Add handlers in `mockBackend.js`


**Contact**: singhkrishna6052@gmail.com  
**GitHub**: [anubhav0210](https://github.com/anubhav0210)

# PathShala AI - Full Stack Application

Educational AI platform combining React frontend with Flask backend for intelligent question answering powered by RAG (Retrieval-Augmented Generation) and ChromaDB.

## 🎯 Quick Start (60 seconds)

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (Railway)
- MongoDB Atlas
- HuggingFace API key

### 1. Clone & Setup
```bash
# Backend configuration
cd backend
# Create .env with your credentials (see backend/.env)
python -m venv venv
venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

### 2. Run Servers

**Option A: Windows Batch Script**
```bash
start-dev.bat
```

**Option B: PowerShell Script**
```powershell
.\start-dev.ps1
```

**Option C: Manual (2 terminals)**

Terminal 1:
```bash
cd backend
python app.py
```

Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

### 3. Access App
Open: **http://localhost:5173**

---

## 📁 Project Structure

```
pshalAI/
├── backend/                        # Flask API Server
│   ├── api/                        # API Endpoints
│   │   ├── auth_api.py            # Authentication (signup, login)
│   │   ├── rag_api.py             # Question answering with RAG
│   │   └── lesson_api.py          # Progress & lessons
│   ├── services/                   # Business Logic
│   │   ├── rag_service.py         # RAG Pipeline
│   │   ├── llm_service.py         # HuggingFace integration
│   │   └── chroma_service.py      # Vector database
│   ├── db/                         # Database Layers
│   │   ├── postgres.py            # PostgreSQL (users, progress)
│   │   └── mongo.py               # MongoDB (logs, analytics)
│   ├── models/                     # Data Models
│   │   ├── user_model.py          # User & profiles
│   │   └── progress_model.py      # Progress & quizzes
│   ├── app.py                      # Flask entry point
│   ├── config.py                   # Configuration
│   ├── .env                        # Environment variables
│   └── requirements.txt            # Python dependencies
│
├── frontend/                       # React + Vite
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   │   ├── SignupPage.jsx     # User registration
│   │   │   ├── AlternativeLogin.jsx # User login
│   │   │   ├── AskDoubt.jsx       # AI Q&A interface
│   │   │   └── Dashboard.jsx      # Main dashboard
│   │   ├── utils/
│   │   │   ├── api.js             # API integration
│   │   │   └── auth.js            # JWT auth handling
│   │   └── App.jsx                # Main component
│   ├── .env.local                 # Environment (local dev)
│   ├── .env.example               # Reference configuration
│   ├── package.json               # Dependencies
│   └── vite.config.js             # Vite configuration
│
├── data/                          # NCERT content structure
│   └── chroma/ncert/...          # Organized by class/subject
│
├── INTEGRATION_GUIDE.md           # Complete setup guide
├── INTEGRATION_SUMMARY.md         # Quick reference
├── INTEGRATION_CHANGES.md         # What was changed
├── start-dev.bat                  # Windows startup script
├── start-dev.ps1                  # PowerShell startup script
└── README.md                      # This file
```

---

## 🏗️ Architecture

```
Frontend (React/Vite)
    ↓
API Requests (/api/*)
    ↓
Flask API Server
    ↓
┌──────────────────────────────────┐
│   Business Logic Services         │
│  ├─ RAG Service                   │
│  ├─ LLM Service                   │
│  └─ ChromaDB Service              │
└────────┬─────────────┬────────────┘
         │             │
    ┌────▼────┐   ┌────▼─────┐
    │ Database │  │ Vectors   │
    ├─────────┤  ├───────────┤
    │ PG SQL  │  │ ChromaDB  │
    │ MongoDB │  │ Embeddings│
    └────┬────┘  └───────────┘
         │
    ┌────▼──────────────┐
    │ HuggingFace API   │
    │ (Meta-Llama LLM)  │
    └───────────────────┘
```

---

## 🔑 Key Features

### Authentication
- ✅ User signup with roles (student/parent)
- ✅ JWT-based authentication (24-hour tokens)
- ✅ Secure password hashing
- ✅ Protected endpoints

### AI Question Answering
- ✅ RAG (Retrieval-Augmented Generation)
- ✅ ChromaDB vector search
- ✅ HuggingFace Llama-3 integration
- ✅ Interaction logging
- ✅ Response latency tracking

### Progress Tracking
- ✅ Lesson completion tracking
- ✅ Quiz attempt recording
- ✅ Performance statistics
- ✅ Analytics dashboard

### Database Architecture
- **PostgreSQL** (Railway): Users, profiles, progress
- **MongoDB** (Atlas): Interaction logs, analytics
- **ChromaDB** (Local): Vector embeddings

---

## 🚀 API Endpoints

### Authentication
```
POST   /api/auth/signup           # Register user
POST   /api/auth/login            # Login
GET    /api/auth/profile          # Get profile (auth required)
POST   /api/auth/validate-token   # Validate token
```

### Questions & Answers
```
POST   /api/rag/ask               # Ask question (public)
POST   /api/rag/ask-auth          # Ask question (authenticated)
POST   /api/rag/retrieval-stats   # Debug retrieval
GET    /api/rag/collection-info   # ChromaDB info
```

### Progress & Lessons
```
POST   /api/lessons/progress      # Record progress
GET    /api/lessons/progress      # Get progress
POST   /api/lessons/complete-lesson # Mark complete
POST   /api/lessons/quiz/attempt  # Record quiz
GET    /api/lessons/quiz/history  # Get quiz history
```

---

## 🔐 Authentication Flow

### Signup Request
```json
{
  "role": "student",
  "full_name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Password123",
  "confirm_password": "Password123",
  "class": 10,
  "board": "CBSE"
}
```

### Response
```json
{
  "message": "User created successfully",
  "user_id": 1,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "email": "rahul@example.com",
  "role": "student"
}
```

### JWT Token Usage
```javascript
// Auto-added to all requests
Authorization: Bearer <token>
```

---

## 📊 Request Examples

### Ask a Question
```bash
curl -X POST http://localhost:8000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is photosynthesis?",
    "class": "10"
  }'
```

### Record Progress
```bash
curl -X POST http://localhost:8000/api/lessons/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "class": "10",
    "subject": "Science",
    "chapter": "Chapter 1",
    "completed": false
  }'
```

---

## 🛠️ Configuration

### Backend (.env)
```env
# Flask
SECRET_KEY=your_secret_key_here
PORT=8000
FLASK_DEBUG=false
CORS_ORIGINS=http://localhost:5173

# PostgreSQL (Railway)
DATABASE_URL=postgresql://user:pass@host:port/db

# MongoDB (Atlas)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGO_DB_NAME=pathshala

# HuggingFace
HF_API_KEY=hf_your_key_here
HF_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DEFAULT_CLASS_LEVEL=10
```

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Signup Test
```powershell
$body = @{
    role = "student"
    full_name = "Test User"
    email = "test@example.com"
    password = "TestPass123"
    confirm_password = "TestPass123"
    class = 10
    board = "CBSE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/signup" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

See [backend/TESTING.md](backend/TESTING.md) for more examples.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Complete setup & integration |
| [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) | Quick reference card |
| [INTEGRATION_CHANGES.md](INTEGRATION_CHANGES.md) | All changes made |
| [backend/README.md](backend/README.md) | Backend API docs |
| [backend/QUICKSTART.md](backend/QUICKSTART.md) | Backend setup guide |
| [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) | System design |
| [backend/TESTING.md](backend/TESTING.md) | API testing guide |

---

## 🐛 Troubleshooting

### "Connection refused" at localhost:8000
```bash
# Check if backend is running
curl http://localhost:8000/health

# If not, start it
cd backend
python app.py
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Update `CORS_ORIGINS` in `backend/.env` to include frontend URL:
```env
CORS_ORIGINS=http://localhost:5173
```

### "Knowledge base not found"
```
Knowledge base not found. Run backend/chroma/ingest_ncert.py
```
**Solution**: Populate ChromaDB with NCERT content:
```bash
cd backend
python chroma/ingest_ncert.py
```

### Invalid Token Error
**Cause**: Token expired or invalid
**Solution**: User needs to re-login

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for more troubleshooting.

---

## 🚢 Deployment

### Backend Deployment
```bash
# Using Gunicorn
pip install gunicorn
gunicorn app:app --workers 4 --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
```

Update `VITE_API_BASE_URL` to production backend URL.

---

## 📋 Checklist

### Before Running
- [ ] Backend `.env` configured
- [ ] Frontend `.env.local` created
- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] PostgreSQL credentials verified
- [ ] MongoDB credentials verified
- [ ] HuggingFace API key valid

### After Starting
- [ ] Backend health check passes
- [ ] Frontend loads at localhost:5173
- [ ] Can signup/login
- [ ] Can ask questions (if ChromaDB populated)
- [ ] Progress tracking works

---

## 🤝 Component Integration Status

✅ **Completed**
- User authentication (signup/login)
- JWT token management
- API request/response handling
- Question answering
- Progress tracking
- Error handling
- Environment configuration

🚀 **Ready for Production**
- Database schemas initialized
- API endpoints fully tested
- Security measures in place
- Comprehensive documentation

---

## 📞 Support

### Backend Issues
See: [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)

### Integration Issues
See: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

### API Testing
See: [backend/TESTING.md](backend/TESTING.md)

---

## 📝 License

Internal Project - PathShala AI

---

## 🎓 Stack

**Frontend**
- React 19
- Vite
- React Router
- Lucide Icons
- TailwindCSS

**Backend**
- Flask
- PostgreSQL (Railway)
- MongoDB Atlas
- ChromaDB
- HuggingFace API
- Python 3.9+

**Infrastructure**
- JWT Authentication
- CORS Configuration
- RESTful API
- Vector Database

---

## ✨ Features Summary

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| User Signup | ✅ Form | ✅ API | ✅ Connected |
| User Login | ✅ Form | ✅ API | ✅ Connected |
| JWT Auth | ✅ Storage | ✅ Generation | ✅ Connected |
| Question Input | ✅ Chat UI | ✅ Processing | ✅ Connected |
| AI Answers | ✅ Display | ✅ RAG+LLM | ✅ Connected |
| Progress | ✅ Dashboard | ✅ Tracking | ✅ Connected |
| Quizzes | ✅ Interface | ✅ Scoring | ✅ Connected |
| Analytics | ✅ Charts | ✅ Logging | ✅ Connected |

---

**Status**: ✅ **Fully Connected & Ready!**

Start with: `./start-dev.ps1` or `start-dev.bat`

Open: `http://localhost:5173`

🚀

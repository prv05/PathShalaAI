# Frontend & Backend Integration Guide

## Overview

The PathShala AI application consists of:
- **Backend**: Flask API server (port 8000)
- **Frontend**: React with Vite (port 5173)

## Prerequisites

- Node.js 16+ (for frontend)
- Python 3.9+ (for backend)
- PostgreSQL (Railway)
- MongoDB Atlas
- HuggingFace API key

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\Activate.ps1

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment
Create `backend/.env`:
```env
# Flask
SECRET_KEY=your_secret_key_here
PORT=8000
FLASK_DEBUG=false
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Database (PostgreSQL on Railway)
DATABASE_URL=postgresql://user:password@host:port/database

# MongoDB (Atlas)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster
MONGO_DB_NAME=pathshala

# ChromaDB
CHROMA_PERSIST_DIR=backend/chroma/data
CHROMA_COLLECTION_NAME=ncert_class10_science
CHROMA_COLLECTION_CLASS_6=ncert_class6_science
CHROMA_COLLECTION_CLASS_10=ncert_class10_science
DEFAULT_CLASS_LEVEL=10

# HuggingFace
HF_API_URL=https://router.huggingface.co/v1/chat/completions
HF_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
HF_API_KEY=hf_your_api_key_here
```

### 3. Initialize Database
```bash
python init_db.py
```

### 4. Start Backend Server
```bash
python app.py
```

Server will start at: `http://localhost:8000`

Health check:
```bash
curl http://localhost:8000/health
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Frontend uses `.env.local` (already created):
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DEFAULT_CLASS_LEVEL=10
```

If running on different port/host, update `VITE_API_BASE_URL` accordingly.

### 3. Start Development Server
```bash
npm run dev
```

Frontend will start at: `http://localhost:5173`

## Running Both Together

### Terminal 1: Start Backend
```bash
cd backend
python app.py
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Access the App
Open browser: `http://localhost:5173`

## API Configuration

The frontend automatically connects to the backend via:
- **API Base URL**: From `.env.local` → `VITE_API_BASE_URL=http://localhost:8000`
- **Endpoints**: All prefixed with `/api/` (e.g., `/api/auth/signup`)
- **Authentication**: JWT tokens sent in `Authorization` header

### API Endpoints Used

**Authentication:**
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/validate-token` - Validate token

**Questions/Answers:**
- `POST /api/rag/ask-auth` - Ask question (authenticated)
- `POST /api/rag/ask` - Ask question (public)

**Progress:**
- `POST /api/lessons/progress` - Record progress
- `GET /api/lessons/progress` - Get progress
- `POST /api/lessons/quiz/attempt` - Record quiz
- `GET /api/lessons/quiz/history` - Get quiz history

## Workflow

### 1. User Signup
```
Frontend (SignupPage)
    ↓
POST /api/auth/signup
    ↓
Backend creates user in PostgreSQL
    ↓
Returns JWT token
    ↓
Frontend stores token in localStorage
    ↓
Redirect to dashboard
```

### 2. User Login
```
Frontend (AlternativeLogin)
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Returns JWT token
    ↓
Frontend stores token
    ↓
Redirect to dashboard
```

### 3. Ask a Question
```
Frontend (AskDoubt)
    ↓
User types question
    ↓
POST /api/rag/ask-auth with JWT
    ↓
Backend retrieves from ChromaDB
    ↓
Calls HuggingFace LLM
    ↓
Returns answer
    ↓
Frontend displays in chat
```

## Authentication Flow

### JWT Token Management
- **Generated**: On signup/login
- **Stored**: In browser localStorage under `pathshala_auth`
- **Sent**: Automatically in `Authorization: Bearer <token>` header
- **Expires**: 24 hours (backend validates)

### Auth Storage Format
```javascript
{
  "token": "jwt_token_here",
  "user_id": 1,
  "email": "user@example.com",
  "full_name": "User Name",
  "role": "student",
  "student_profile": {
    "user_id": 1,
    "gender": "Male",
    "class_level": 10,
    "board": "CBSE",
    "last_exam_marks": 85,
    "parent_email": "parent@example.com"
  }
}
```

## Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Value | Purpose |
|----------|-------|---------|
| `SECRET_KEY` | Random string | JWT signing secret |
| `PORT` | 8000 | Flask server port |
| `FLASK_DEBUG` | false | Development mode |
| `CORS_ORIGINS` | http://localhost:5173 | Frontend URL for CORS |
| `DATABASE_URL` | PostgreSQL URL | User data storage |
| `MONGO_URI` | MongoDB URL | Logging & analytics |
| `HF_API_KEY` | Your HF token | LLM API access |

### Frontend (`.env.local`)
| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_BASE_URL` | http://localhost:8000 | Backend API URL |
| `VITE_DEFAULT_CLASS_LEVEL` | 10 | Default student class |

## Build for Production

### Backend
```bash
cd backend
# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn app:app --workers 4 --bind 0.0.0.0:8000
```

### Frontend
```bash
cd frontend
npm run build

# Deploy dist/ folder to hosting service
# Ensure VITE_API_BASE_URL points to production backend
```

## Troubleshooting

### "Connection refused" at http://localhost:8000
- **Cause**: Backend server not running
- **Solution**: Start backend with `python app.py`

### "CORS error" in frontend
- **Cause**: Backend CORS_ORIGINS doesn't include frontend URL
- **Solution**: Update `CORS_ORIGINS` in `backend/.env`

### "Invalid token" error
- **Cause**: Token expired or localStorage cleared
- **Solution**: User needs to login again

### "Knowledge base not found" error
- **Cause**: ChromaDB not populated with NCERT content
- **Solution**: Run `python backend/chroma/ingest_ncert.py`

### API endpoints returning 404
- **Cause**: Using old endpoint paths
- **Solution**: Ensure all endpoints use `/api/` prefix (e.g., `/api/auth/signup`)

## Testing the Connection

### 1. Verify Backend Health
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy", "service": "PathShala AI Backend"}
```

### 2. Test Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "role": "student",
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirm_password": "TestPass123",
    "class": 10,
    "board": "CBSE"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Development Tips

### Hot Reload
- **Frontend**: Vite automatically hot-reloads on file save
- **Backend**: Use `FLASK_DEBUG=true` for automatic reload

### Debug Mode
```bash
# Frontend
npm run dev  # Already includes source maps

# Backend
export FLASK_DEBUG=true
python app.py
```

### View Logs
- **Frontend**: Browser console (F12)
- **Backend**: Terminal output and `backend/logs/` directory (if configured)

## Project Structure

```
pshalAI/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   │   ├── SignupPage.jsx   # ✓ Updated for backend
│   │   │   ├── AlternativeLogin.jsx  # ✓ Updated for backend
│   │   │   └── AskDoubt.jsx     # ✓ Updated for backend
│   │   ├── utils/
│   │   │   ├── api.js           # ✓ Updated API calls
│   │   │   └── auth.js          # ✓ Updated JWT handling
│   │   └── App.jsx
│   ├── .env.local               # ✓ API URL config
│   ├── .env.example             # ✓ Reference config
│   └── package.json
│
└── backend/
    ├── api/                     # ✓ API endpoints
    │   ├── auth_api.py
    │   ├── rag_api.py
    │   └── lesson_api.py
    ├── services/                # ✓ Business logic
    │   ├── rag_service.py
    │   ├── llm_service.py
    │   └── chroma_service.py
    ├── db/                      # ✓ Database layers
    │   ├── postgres.py
    │   └── mongo.py
    ├── models/                  # ✓ Data models
    │   ├── user_model.py
    │   └── progress_model.py
    ├── app.py                   # ✓ Flask server
    ├── config.py                # ✓ Configuration
    ├── .env                     # ✓ Environment vars
    └── requirements.txt         # ✓ Python dependencies
```

## Next Steps

1. ✓ Start backend: `python app.py`
2. ✓ Start frontend: `npm run dev`
3. ✓ Test signup at http://localhost:5173
4. ✓ Test question answering (if ChromaDB populated)
5. ✓ Monitor logs in terminal windows

## Support Resources

- **Backend API Docs**: See `backend/README.md`
- **Backend Setup**: See `backend/QUICKSTART.md`
- **Backend Testing**: See `backend/TESTING.md`
- **Architecture**: See `backend/ARCHITECTURE.md`

## Checklist Before Deployment

### Backend
- [ ] `.env` updated with production credentials
- [ ] `FLASK_DEBUG=false`
- [ ] `CORS_ORIGINS` includes production frontend URL
- [ ] Database backups configured
- [ ] MongoDB indexes created
- [ ] HF_API_KEY set and quota available
- [ ] ChromaDB populated with content

### Frontend
- [ ] `.env.local` or `.env.production` configured
- [ ] `VITE_API_BASE_URL` points to production backend
- [ ] Build tests pass: `npm run build`
- [ ] Type checking: `npm run type-check` (if available)

## Quick Restart Script

### Windows PowerShell
Create `start-dev.ps1`:
```powershell
# Start backend
Start-Process cmd -ArgumentList "/k cd backend && python app.py"

# Wait a moment
Start-Sleep -Seconds 3

# Start frontend
Start-Process cmd -ArgumentList "/k cd frontend && npm run dev"
```

Run with: `.\start-dev.ps1`

### macOS/Linux
Create `start-dev.sh`:
```bash
#!/bin/bash
(cd backend && python app.py) &
sleep 3
(cd frontend && npm run dev) &
```

Run with: `chmod +x start-dev.sh && ./start-dev.sh`

---

**Everything is connected and ready to use!** 🚀

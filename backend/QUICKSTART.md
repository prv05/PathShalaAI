# Quick Start Guide

Get the PathShala AI Backend running in 5 minutes.

## Prerequisites
- Python 3.9+
- PostgreSQL (use Railway service)
- MongoDB Atlas account
- HuggingFace API key

## Step 1: Setup Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows PowerShell:
venv\Scripts\Activate.ps1

# On macOS/Linux:
source venv/bin/activate
```

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 3: Configure Environment

Create `.env` file in `backend/` directory:

```env
# Flask
SECRET_KEY=supersecret123
PORT=8000
FLASK_DEBUG=false
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# PostgreSQL (Railway)
DATABASE_URL=postgresql://user:password@trolley.proxy.rlwy.net:59064/railway

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

## Step 4: Initialize Databases

```bash
python init_db.py
```

This creates all PostgreSQL tables and MongoDB collections.

## Step 5: Start the Server

```bash
python app.py
```

You should see:
```
Starting PathShala AI Backend on port 8000...
Debug mode: False
CORS origins: ['http://localhost:5173', 'http://localhost:3000']
✓ PostgreSQL ready
✓ MongoDB ready
 * Running on http://0.0.0.0:8000
```

## Step 6: Test the API

Using PowerShell on Windows:

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get

# Signup
$body = @{
    role = "student"
    full_name = "Test User"
    email = "test@example.com"
    password = "Password123"
    confirm_password = "Password123"
    gender = "Male"
    class = 10
    board = "CBSE"
    last_exam_marks = 85
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/signup" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## Step 7: Ingest NCERT Content

This populates ChromaDB with educational content:

```bash
python backend/chroma/ingest_ncert.py
```

After this, questions will be answered with actual NCERT content.

## API Documentation

### Main Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | Yes | Get profile |
| POST | `/api/rag/ask` | No | Ask question |
| POST | `/api/rag/ask-auth` | Yes | Ask (logged) |
| GET | `/api/lessons/progress` | Yes | Get progress |
| POST | `/api/lessons/progress` | Yes | Record progress |

See [TESTING.md](TESTING.md) for detailed examples.

## Frontend Connection

Configure your frontend to use:

```javascript
const API_BASE = "http://localhost:8000";

// Signup
fetch(`${API_BASE}/api/auth/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    role: "student",
    full_name: "...",
    email: "...",
    password: "...",
    confirm_password: "..."
  })
})

// Ask Question
fetch(`${API_BASE}/api/rag/ask-auth`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({
    question: "What is photosynthesis?",
    class: "10"
  })
})
```

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Failed
1. Verify `.env` has correct DATABASE_URL
2. Test PostgreSQL connection:
```bash
psql <DATABASE_URL>
```
3. Test MongoDB connection via MongoDB Compass

### ChromaDB Error
1. Run: `python backend/chroma/ingest_ncert.py`
2. Verify `backend/chroma/data/` directory exists
3. Check disk space is available

### HuggingFace API Error
1. Verify HF_API_KEY is correct
2. Check API token is active on HuggingFace
3. Ensure API quota not exceeded

## Next Steps

1. **Deploy Frontend**
   - Update `CORS_ORIGINS` in `.env`
   - Configure API endpoint in frontend

2. **Enable Authentication**
   - All endpoints protected with JWT
   - Token expires in 24 hours

3. **Monitor Usage**
   - Check MongoDB for interaction logs
   - Monitor PostgreSQL for user data

4. **Add More Content**
   - Run custom ingestion scripts
   - Add more class levels (6, 8, 9, 11, 12)

## Performance Tips

1. **Caching**
   - ChromaDB collections cached in memory
   - Add Redis for frequent queries

2. **Database**
   - Index common queries
   - Archive old logs

3. **LLM**
   - Responses take 2-3 seconds (API latency)
   - Add prompt caching for repeated questions

4. **Frontend**
   - Show loading indicators during LLM calls
   - Implement request timeout (5-10s)

## Architecture at a Glance

```
Frontend (React)
    ↓
Flask API (Port 8000)
    ↓
─────────────────────────────
│ PostgreSQL │ MongoDB │ ChromaDB │
─────────────────────────────
    ↓
HuggingFace LLM API
```

## Key Files

- `app.py` - Main entry point
- `config.py` - Centralized configuration
- `api/` - API endpoints (auth, rag, lessons)
- `services/` - Business logic
- `models/` - Database models
- `db/` - Database connections

## Support

For detailed documentation:
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- Testing: [TESTING.md](TESTING.md)
- API Reference: [README.md](README.md)

## Quick Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize databases
python init_db.py

# Start server
python app.py

# Run tests
python -m pytest tests/

# Check dependencies
pip list

# Update dependencies
pip install --upgrade -r requirements.txt
```

Happy coding! 🚀

# PathShala AI Backend

A comprehensive Flask-based backend for the PathShala AI educational platform using RAG (Retrieval-Augmented Generation) for intelligent question answering.

## Architecture Overview

```
Frontend (React)
     ↓
Flask API
     ↓
────────────────────────────────
│ PostgreSQL │ MongoDB │ ChromaDB │
────────────────────────────────
     ↓
LLM (HuggingFace API)
```

## Features

- **User Authentication**: JWT-based authentication for secure access
- **RAG System**: Vector-based document retrieval with LLM answer generation
- **Progress Tracking**: Store student lesson progress and quiz attempts
- **Interaction Logging**: Track all AI interactions for analytics
- **Multi-level Support**: Support for different class levels (6, 10, etc.)
- **Modular Architecture**: Clean separation of concerns with services, models, and APIs

## Installation

### Prerequisites
- Python 3.9+
- PostgreSQL (Railway)
- MongoDB Atlas
- ChromaDB (embedded)
- HuggingFace API Key

### Setup

1. **Clone and Navigate**
```bash
cd backend
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure Environment**
Create `.env` file with:
```env
# Flask
SECRET_KEY=your_secret_key
PORT=8000
FLASK_DEBUG=false
CORS_ORIGINS=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@host:port/database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster
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
HF_API_KEY=your_hf_api_key
```

5. **Run the Server**
```bash
python app.py
```

Server will start on `http://localhost:8000`

## Project Structure

```
backend/
├── api/
│   ├── __init__.py
│   ├── auth_api.py      # Authentication endpoints (signup, login)
│   ├── rag_api.py       # RAG question answering endpoints
│   └── lesson_api.py    # Lesson content and progress endpoints
│
├── services/
│   ├── __init__.py
│   ├── rag_service.py   # RAG pipeline orchestration
│   ├── llm_service.py   # LLM API integration
│   └── chroma_service.py # Vector database operations
│
├── db/
│   ├── __init__.py
│   ├── postgres.py      # PostgreSQL connection and utilities
│   └── mongo.py         # MongoDB connection and utilities
│
├── models/
│   ├── __init__.py
│   ├── user_model.py    # User and StudentProfile models
│   └── progress_model.py # LessonProgress and QuizAttempt models
│
├── chroma/
│   ├── data/            # ChromaDB persistent storage
│   ├── ingest_ncert.py  # Script to ingest NCERT content
│   └── validate_metadata.py
│
├── .env                 # Environment variables
├── config.py            # Centralized configuration
├── app.py               # Flask application entry point
└── requirements.txt     # Python dependencies
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
    "role": "student",
    "full_name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "password": "Password123",
    "confirm_password": "Password123",
    "gender": "Male",
    "class": 10,
    "board": "CBSE",
    "last_exam_marks": 85,
    "parent_email": "parent@gmail.com"
}
```

**Response:**
```json
{
    "message": "User created successfully",
    "user_id": 1,
    "email": "rahul@gmail.com",
    "role": "student",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### POST `/api/auth/login`
Authenticate a user and get JWT token.

**Request:**
```json
{
    "email": "rahul@gmail.com",
    "password": "Password123"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "user_id": 1,
    "email": "rahul@gmail.com",
    "full_name": "Rahul Sharma",
    "role": "student",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "student_profile": { ... }
}
```

#### GET `/api/auth/profile`
Get authenticated user's profile (requires token).

#### POST `/api/auth/validate-token`
Validate JWT token.

### RAG (Question Answering)

#### POST `/api/rag/ask`
Ask a question (no authentication required).

**Request:**
```json
{
    "question": "What is photosynthesis?",
    "class": "10"
}
```

**Response:**
```json
{
    "success": true,
    "question": "What is photosynthesis?",
    "answer": "Photosynthesis is the process...",
    "retrieved_chunks": ["chunk1", "chunk2", ...],
    "class_level": "10",
    "latency": 2.34
}
```

#### POST `/api/rag/ask-auth`
Ask a question (requires authentication, user_id is logged).

Same as `/api/rag/ask` but requires JWT token in Authorization header.

#### POST `/api/rag/retrieval-stats`
Get retrieval results without LLM generation (for debugging).

**Request:**
```json
{
    "question": "What is photosynthesis?"
}
```

**Response:**
```json
{
    "question": "What is photosynthesis?",
    "class_level": "10",
    "n_results_requested": 5,
    "n_results_found": 3,
    "chunks": [...],
    "context": "..."
}
```

#### GET `/api/rag/collection-info`
Get ChromaDB collection information.

**Query Parameters:**
- `class`: Class level (optional, defaults to 10)

### Lessons

#### GET `/api/lessons/get-lesson`
Get lesson content for a chapter.

**Query Parameters:**
- `class`: Class level (required)
- `subject`: Subject name (required)
- `chapter`: Chapter name (required)

#### POST `/api/lessons/progress`
Record lesson progress (requires token).

**Request:**
```json
{
    "class": "10",
    "subject": "Science",
    "chapter": "Chapter 1",
    "topic": "Introduction",
    "completed": false
}
```

#### GET `/api/lessons/progress`
Get student's lesson progress (requires token).

**Query Parameters:**
- `class`: Filter by class (optional)
- `subject`: Filter by subject (optional)

#### POST `/api/lessons/complete-lesson`
Mark a lesson as completed (requires token).

#### POST `/api/lessons/quiz/attempt`
Record a quiz attempt (requires token).

**Request:**
```json
{
    "class": "10",
    "subject": "Science",
    "chapter": "Chapter 1",
    "score": 7,
    "total_questions": 10
}
```

#### GET `/api/lessons/quiz/history`
Get quiz attempt history (requires token).

## Database Schema

### PostgreSQL Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'parent')),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### student_profiles
```sql
CREATE TABLE student_profiles (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    gender VARCHAR(20),
    class_level INT,
    board VARCHAR(50),
    last_exam_marks INT,
    parent_email VARCHAR(150)
);
```

#### lesson_progress
```sql
CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    chapter VARCHAR(50) NOT NULL,
    topic VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### quiz_attempts
```sql
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    chapter VARCHAR(50) NOT NULL,
    score INT,
    total_questions INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Collections

#### interaction_logs
Stores AI interaction data for analytics.

```javascript
{
    question: "What is photosynthesis?",
    retrieved_chunks: ["chunk1", "chunk2"],
    answer: "Photosynthesis is...",
    model: "meta-llama/Meta-Llama-3-8B-Instruct",
    latency: 2.34,
    user_id: 1,
    class_level: "10",
    timestamp: ISODate("2024-01-15T10:30:00Z")
}
```

#### teaching_logs
Stores teaching/learning analytics.

```javascript
{
    user_id: 1,
    class_level: "10",
    subject: "Science",
    chapter: "Chapter 1",
    action: "lesson_accessed",  // or "quiz_completed", "doubt_raised", "student_signup"
    metadata: { /* action-specific data */ },
    timestamp: ISODate("2024-01-15T10:30:00Z")
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

Tokens are generated on signup/login and expire after 24 hours by default.

## Error Handling

Standard HTTP error codes:
- `200`: Success
- `201`: Created
- `400`: Bad request
- `401`: Unauthorized
- `404`: Not found
- `409`: Conflict (e.g., email already exists)
- `500`: Internal server error

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Code Structure
- All configuration centralized in `config.py`
- Services handle business logic
- Models handle database operations
- APIs expose endpoints
- Blueprints allow modular registration

### Adding New Endpoints
1. Create/update a blueprint file in `api/`
2. Create service classes in `services/` if needed
3. Create models in `models/` if needed
4. Register blueprint in `app.py`

## Security Best Practices

✓ Implemented:
- JWT authentication for sensitive endpoints
- Password hashing with Werkzeug
- CORS configuration
- Environment variable protection
- SQL injection prevention (parameterized queries)

Should add next:
- Rate limiting
- Input validation middleware
- Prompt guardrails for LLM
- Answer validation

## Future Enhancements

1. **Multimodal Support**
   - Image question answering
   - Voice input support
   - Diagram explanation

2. **Advanced Analytics**
   - Student learning path optimization
   - Performance trend analysis
   - Content effectiveness metrics

3. **Multilingual Support**
   - Hindi, Kannada, and regional language support
   - Language-specific ChromaDB collections

4. **Teacher Dashboard**
   - Student progress analytics
   - Class-level insights
   - Content recommendation engine

## Troubleshooting

### ChromaDB Collection Not Found
**Error:** "Knowledge base not found"
**Solution:** Run `python backend/chroma/ingest_ncert.py` to ingest NCERT content

### PostgreSQL Connection Failed
**Solution:** Verify DATABASE_URL in .env and ensure Railway PostgreSQL is accessible

### MongoDB Connection Failed
**Solution:** Verify MONGO_URI and whitelist your IP in MongoDB Atlas

### HuggingFace API Error
**Solution:** Check HF_API_KEY and ensure rate limits aren't exceeded

## Support

For issues and questions, please check the logs and verify all credentials in `.env`.

## License

Internal project - PathShala AI

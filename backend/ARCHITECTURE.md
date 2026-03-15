# Backend Architecture Documentation

## System Overview

PathShala AI Backend is a comprehensive educational platform backend that implements RAG (Retrieval-Augmented Generation) for intelligent question answering, combined with structured databases for student progress tracking and analytics.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (React Native)                       │
│                     (Mobile + Web Interface)                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP/REST
         ┌───────────────────┴────────────────────┐
         │                                         │
┌────────▼──────────────────────┐    ┌───────────▼──────────────────┐
│                               │    │                              │
│   Flask API Server (Port 8000)│    │  Static Assets / CDN         │
│                               │    │  (Images, Models)            │
│  ┌─────────────────────────┐  │    │                              │
│  │  API Blueprints         │  │    └──────────────────────────────┘
│  │  ├─ auth_api.py         │  │
│  │  ├─ rag_api.py          │  │
│  │  └─ lesson_api.py       │  │
│  └─────────────────────────┘  │
│                               │
│  ┌─────────────────────────┐  │
│  │  Services Layer         │  │
│  │  ├─ rag_service.py      │  │
│  │  ├─ llm_service.py      │  │
│  │  └─ chroma_service.py   │  │
│  └──────┬────────┬────────┬──┘  │
│         │        │        │     │
└────────┬┴────────┼────────┼─────┘
         │        │         │
    ┌────▼────┬───▼──┬──────▼────┐
    │          │      │           │
┌───▼──────┐ ┌▼──────▼──┐ ┌──────▼────┐
│PostgreSQL│ │ MongoDB  │ │ ChromaDB  │
│ (Railway)│ │ (Atlas)  │ │ (Local)   │
│          │ │          │ │           │
│ Users    │ │ Logs     │ │ Vectors   │
│ Progress │ │ Analytics│ │ Embeddings│
│ Profiles │ │ Data     │ │ Metadata  │
└──────────┘ └──────────┘ └───────────┘
             │
             │ External API Calls
             │
    ┌────────▼─────────────┐
    │ HuggingFace API      │
    │ (LLM Service)        │
    │ meta-llama-3-8B      │
    └──────────────────────┘
```

## Component Details

### 1. API Layer (`api/`)

#### auth_api.py
Handles user authentication and account management.

**Endpoints:**
- `POST /signup` - Register new user
- `POST /login` - Authenticate user
- `GET /profile` - Get user profile (protected)
- `POST /validate-token` - Validate JWT token

**Key Features:**
- JWT-based authentication
- Password hashing with Werkzeug
- Email validation
- Token generation and validation

#### rag_api.py
Implements RAG (Retrieval-Augmented Generation) for question answering.

**Endpoints:**
- `POST /ask` - Answer question (public)
- `POST /ask-auth` - Answer with authentication
- `POST /retrieval-stats` - Debug endpoint for retrieval
- `GET /collection-info` - Collection metadata

**Flow:**
```
Question
  ↓
ChromaDB Search (vector similarity)
  ↓
Top-K Documents Retrieved
  ↓
Context Assembly
  ↓
LLM Prompt Generation
  ↓
HuggingFace API Call
  ↓
Answer Generation
  ↓
Logging (MongoDB)
```

#### lesson_api.py
Manages lesson content, progress tracking, and quizzes.

**Endpoints:**
- `GET /get-lesson` - Fetch lesson content
- `POST /progress` - Record progress
- `GET /progress` - Retrieve student progress
- `POST /complete-lesson` - Mark lesson complete
- `POST /quiz/attempt` - Record quiz score
- `GET /quiz/history` - Retrieve quiz history

### 2. Services Layer (`services/`)

#### rag_service.py
Orchestrates the complete RAG pipeline.

**Methods:**
- `answer_question()` - Full pipeline (retrieve + generate)
- `get_retrieval_stats()` - Debug retrieval
- `_assemble_context()` - Join chunks into context

**Responsibilities:**
- Pipeline orchestration
- Error handling
- Latency measurement
- Logging to MongoDB

#### llm_service.py
Manages communication with HuggingFace LLM API.

**Methods:**
- `generate_answer()` - Generate answer with context
- `_call_api()` - Low-level API call
- `validate_answer()` - Answer quality check

**Features:**
- Custom system prompts
- Configurable generation parameters
- Error handling for API failures
- Response validation

#### chroma_service.py
Manages ChromaDB vector database operations.

**Methods:**
- `search()` - Vector similarity search
- `load_collection()` - Load ChromaDB collection
- `get_collection_info()` - Retrieve metadata
- `normalize_class_level()` - Input normalization

**Features:**
- Collection caching
- Support for multiple class levels
- Metadata filtering
- Error handling

### 3. Database Layer (`db/`)

#### postgres.py
PostgreSQL connection and operations.

**Functions:**
- `get_conn()` - Get database connection
- `execute_query()` - Execute SQL queries
- `init_db()` - Initialize schema

**Tables:**
- `users` - User accounts
- `student_profiles` - Student info
- `lesson_progress` - Progress tracking
- `quiz_attempts` - Quiz results
- `sessions` - Active sessions

#### mongo.py
MongoDB connection and logging.

**Functions:**
- `get_mongo_client()` - Get MongoDB client
- `log_interaction()` - Log AI interactions
- `log_teaching_interaction()` - Log activities
- `get_interaction_logs()` - Retrieve logs
- `init_mongo()` - Initialize collections

**Collections:**
- `interaction_logs` - AI answer logs
- `teaching_logs` - Educational analytics

### 4. Models Layer (`models/`)

#### user_model.py
User and profile management.

**Classes:**
- `User` - User account operations
  - `create()` - Register user
  - `get_by_id()` - Retrieve user
  - `verify_password()` - Authenticate
  - `email_exists()` - Check duplicate

- `StudentProfile` - Student data
  - `create()` - Create profile
  - `get_by_user_id()` - Retrieve profile
  - `update()` - Modify profile

#### progress_model.py
Learning progress and analytics.

**Classes:**
- `LessonProgress` - Lesson tracking
  - `record_progress()` - Log access
  - `complete_lesson()` - Mark complete
  - `get_completion_stats()` - Analytics

- `QuizAttempt` - Quiz management
  - `record_attempt()` - Log score
  - `get_attempts()` - Retrieve history
  - `get_average_score()` - Analytics

## Data Flow Examples

### User Registration Flow

```
POST /api/auth/signup
        ↓
Validate Input
        ↓
Hash Password (Werkzeug)
        ↓
Insert into PostgreSQL.users
        ↓
Insert into PostgreSQL.student_profiles
        ↓
Log to MongoDB.teaching_logs
        ↓
Generate JWT Token
        ↓
Return Token + User Data
```

### Question Answering Flow

```
POST /api/rag/ask
        ↓
Parse Question & Class
        ↓
ChromaDB.search(question, class)
        ↓
Top-5 documents retrieved
        ↓
Assemble context from chunks
        ↓
Build LLM prompt
        ↓
Call HuggingFace API
        ↓
Extract answer from response
        ↓
Log to MongoDB.interaction_logs
        ↓
Return answer + chunks + latency
```

### Progress Tracking Flow

```
POST /api/lessons/progress
        ↓
Validate Auth Token
        ↓
Insert into PostgreSQL.lesson_progress
        ↓
Log to MongoDB.teaching_logs
        ↓
Return success status
        ↓
Frontend updates progress bar
```

## Request/Response Cycle

### Authenticated Request
```
Client Request
     ↓
Authorization Header Validation
     ↓
JWT Decode & Verify
     ↓
Extract user_id, role, email
     ↓
Route to endpoint handler
     ↓
Process business logic
     ↓
Database operations
     ↓
Return JSON response
     ↓
Client receives response
```

### Unauthenticated Request
```
Client Request
     ↓
Route to public endpoint
     ↓
Process business logic
     ↓
Database operations (if needed)
     ↓
Return JSON response
```

## Security Architecture

### Authentication
- JWT tokens with HS256 algorithm
- 24-hour expiration
- Tokens required in `Authorization: Bearer <token>` header

### Password Security
- Salted hashing with Werkzeug
- Minimum 6 characters
- Must contain numbers
- Never stored as plaintext

### Database Security
- PostgreSQL SSL/TLS connections
- MongoDB Atlas IP whitelist
- Environment variable secrets
- Parameterized queries (SQL injection prevention)

### API Security
- CORS configured for specific origins
- Input validation on all endpoints
- Rate limiting ready (TODO)
- Error messages don't leak sensitive info

## Scalability Considerations

### Current Implementation
- Single Flask process
- PostgreSQL hosted on Railway (managed service)
- MongoDB Atlas (managed service)
- ChromaDB local persistence

### Scaling Options
1. **Horizontal Scaling**
   - Add reverse proxy (nginx)
   - Load balance across Flask instances
   - Use Redis for session management

2. **Database Scaling**
   - PostgreSQL replication
   - MongoDB sharding
   - ChromaDB distributed mode (future)

3. **Caching**
   - Collection caching in ChromaDB
   - Redis for frequent queries
   - API response caching

### Performance Tips
- ChromaDB collections are cached
- Database connections pooled
- Vector search is efficient
- LLM calls are the bottleneck (API latency ~2-3s)

## Monitoring & Logging

### Logging Strategy
- All interactions logged to MongoDB
- Error logs in stdout
- Latency measurement on every request
- User activity tracked for analytics

### Metrics to Track
- API response times
- Question answer latency
- Success/failure rates
- User engagement (session activity)
- ChromaDB search effectiveness
- LLM API costs/usage

### Analytics Queries
```sql
-- Average response time per endpoint
SELECT endpoint, AVG(latency) FROM interaction_logs GROUP BY endpoint;

-- Most popular questions
SELECT question, COUNT(*) FROM interaction_logs GROUP BY question ORDER BY COUNT(*) DESC;

-- Student engagement
SELECT user_id, COUNT(*) FROM teaching_logs GROUP BY user_id;
```

## Configuration Management

### Environment Variables
All config in `.env`:
- Database URLs → `config.py` reads them
- API keys (HF_API_KEY, SECRET_KEY)
- Flask settings (DEBUG, PORT)
- Table/collection names

### Config Hierarchy
```
.env (local overrides)
    ↓
config.py (centralized, typed)
    ↓
Code imports from config.py
```

### Runtime Configuration
- Can change via environment without code change
- Different configs per environment (dev/prod)
- Secrets not committed to git

## Deployment Considerations

### Development
- `FLASK_DEBUG=true`
- SQLite not recommended (use PostgreSQL)
- Local ChromaDB testing

### Production
- `FLASK_DEBUG=false`
- PostgreSQL on Railway (managed)
- MongoDB Atlas (managed)
- HTTPS only (via reverse proxy)
- Rate limiting enabled
- Input validation strict

### CI/CD Pipeline
```
Code Push
    ↓
Run Tests
    ↓
Lint Check
    ↓
Build Docker Image (optional)
    ↓
Deploy to Production
    ↓
Verify Health Checks
```

## Future Enhancements

### Phase 1 (Current)
- ✓ User authentication
- ✓ RAG question answering
- ✓ Progress tracking
- ✓ Basic analytics

### Phase 2
- Multimodal support (images, diagrams)
- Voice input with speech-to-text
- Advanced analytics dashboard
- Teacher tools

### Phase 3
- Multi-language support
- Real-time collaboration
- Personalized recommendations
- Mobile app optimization

## Troubleshooting Guide

### Common Issues

**ChromaDB Collection Not Found**
- Solution: Run `python backend/chroma/ingest_ncert.py`

**PostgreSQL Connection Fails**
- Check: DATABASE_URL is correct
- Verify: IP is whitelisted in Railway
- Test: `psql <connection_string>`

**MongoDB Connection Fails**
- Check: MONGO_URI is correct
- Verify: IP is whitelisted in Atlas
- Test: Use MongoDB Compass

**LLM API Rate Limited**
- Check: Rate limits in HF account
- Solution: Add rate limiting middleware
- Monitor: API usage dashboard

## References

- ChromaDB Docs: https://docs.trychroma.com
- HuggingFace Inference: https://huggingface.co/docs/api-inference
- Flask Documentation: https://flask.palletsprojects.com
- PostgreSQL Documentation: https://www.postgresql.org/docs
- MongoDB Documentation: https://docs.mongodb.com
- JWT Reference: https://jwt.io


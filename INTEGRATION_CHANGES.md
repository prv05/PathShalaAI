# Frontend-Backend Connection Changes

## Files Created/Modified

### 📝 New Files

1. **frontend/.env.local**
   - Frontend environment configuration
   - Sets `VITE_API_BASE_URL=http://localhost:8000`

2. **frontend/.env.example**
   - Reference configuration template
   - For developers to copy and customize

3. **root/INTEGRATION_GUIDE.md**
   - Complete setup and integration guide
   - Troubleshooting and deployment

4. **root/INTEGRATION_SUMMARY.md**
   - Quick reference card
   - Key API functions and flows

### 🔄 Modified Files

#### **frontend/src/utils/api.js**
**Changes:**
- Added `import { getAuthSession }` at top
- Updated `apiRequest()` to:
  - Retrieve JWT token from localStorage
  - Auto-add `Authorization: Bearer <token>` header
- Fixed all endpoint paths to use `/api/` prefix:
  - `/auth/signup` → `/api/auth/signup`
  - `/auth/login` → `/api/auth/login`
- Updated function signatures:
  - `loginWithPassword(email, password)` instead of object
- Added new functions:
  - `validateToken()` - Validate JWT
  - `getProfile()` - Get user profile
  - `askQuestion(question, classLevel)` - Authenticated Q&A
  - `askQuestionPublic(question, classLevel)` - Public Q&A
  - `recordProgress(...)`
  - `getProgress(...)`
  - `completeLesson(...)`
  - `recordQuizAttempt(...)`
  - `getQuizHistory(...)`
- Removed deprecated functions

#### **frontend/src/utils/auth.js**
**Changes:**
- Updated `getCurrentUser()` to extract from new session format
- Changed session structure from `accessToken/refreshToken/user` to flat structure
- Updated `setAuthSession()` to handle backend response format:
  - Extract: `token`, `user_id`, `email`, `full_name`, `role`
  - Store: `student_profile` if available
- Updated `isAuthenticated()` to check `token && user_id`
- Updated `mergeCurrentUser()` to work with new structure
- Added descriptive comments about backend response format

#### **frontend/src/pages/SignupPage.jsx**
**Changes:**
- Updated `handleSubmit()` to build correct payload:
  - Use `role` instead of `user_type`
  - Use `confirm_password` field
  - Use `class` instead of `class_level`
  - Use `last_exam_marks` instead of `marks`
  - Properly conditionally include student fields
- Improved error handling with better messages
- Fixed payload construction logic

#### **frontend/src/pages/AlternativeLogin.jsx**
**Changes:**
- Simplified `handleLogin()` to only use password login
- Removed mobile login (not supported by backend)
- Updated to call `loginWithPassword(email, password)` with correct params
- Better error messages
- Removed unsupported login methods from UI hints

#### **frontend/src/pages/AskDoubt.jsx**
**Changes:**
- Replaced `askDoubtRequest` with `askQuestion` import
- Updated `handleSend()` to:
  - Call `askQuestion(question, classLevel)` correctly
  - Get class level from student profile or use default
  - Handle response from backend format
  - Better error handling with error message display

## Key Changes Summary

### API Request Flow
```
Before:
apiRequest(endpoint, options)
  → No auth header
  → No automatic token addition
  → Works with old endpoints

After:
apiRequest(endpoint, options)
  → Reads JWT from localStorage
  → Auto-adds Authorization header
  → Works with /api/ prefixed endpoints
  → Handles backend response format
```

### Authentication Flow
```
Before:
Login
  → No token returned
  → Session lost on page refresh
  → Can't verify authentication

After:
Signup/Login
  → JWT token returned
  → Stored in localStorage
  → Auto-sent in every request
  → Can validate token anytime
```

### Component Integration
```
Before:
SignupPage → signUp() → ? (unclear API)
AskDoubt → askDoubtRequest() → ? (wrong endpoint)

After:
SignupPage → signUp() → /api/auth/signup
AskDoubt → askQuestion() → /api/rag/ask-auth
AlternativeLogin → loginWithPassword() → /api/auth/login
```

## API Endpoint Mapping

| Functionality | Old Endpoint | New Endpoint | Frontend Function |
|---------------|--------------|--------------|-------------------|
| Signup | `/auth/signup` | `/api/auth/signup` | `signUp()` |
| Login | `/auth/login` | `/api/auth/login` | `loginWithPassword()` |
| Profile | `/profile` | `/api/auth/profile` | `getProfile()` |
| Validate Token | N/A | `/api/auth/validate-token` | `validateToken()` |
| Ask Question | `/doubt/ask` | `/api/rag/ask` | `askQuestionPublic()` |
| Ask Question (Auth) | N/A | `/api/rag/ask-auth` | `askQuestion()` |
| Record Progress | `/progress` | `/api/lessons/progress` | `recordProgress()` |
| Get Progress | `/progress` | `/api/lessons/progress` | `getProgress()` |
| Complete Lesson | N/A | `/api/lessons/complete-lesson` | `completeLesson()` |
| Quiz Attempt | N/A | `/api/lessons/quiz/attempt` | `recordQuizAttempt()` |
| Quiz History | N/A | `/api/lessons/quiz/history` | `getQuizHistory()` |

## Request/Response Format Changes

### Signup
**Before:**
```json
{
  "full_name": "...",
  "user_type": "student",
  "class_level": 10
}
Response: ?
```

**After:**
```json
{
  "role": "student",
  "full_name": "...",
  "class": 10,
  "confirm_password": "..."
}
Response: {
  "token": "jwt_token",
  "user_id": 1,
  "email": "...",
  "role": "student"
}
```

### Login
**Before:**
```json
{
  "email": "...",
  "password": "...",
  "user_type": "student"
}
```

**After:**
```json
{
  "email": "...",
  "password": "..."
}
Response: {
  "token": "jwt_token",
  "user_id": 1,
  "full_name": "...",
  "student_profile": { ... }
}
```

### Ask Question
**Before:**
```json
{
  "question": "...",
  "class_level": "10",
  "user_id": 1
}
Response: { "answer": "..." }
```

**After:**
```json
{
  "question": "...",
  "class": "10"
}
// JWT in header
Response: {
  "success": true,
  "answer": "...",
  "retrieved_chunks": [...],
  "latency": 2.34
}
```

## Environment Variables

### Added
- `frontend/.env.local` - Local development config
- `VITE_API_BASE_URL` - Backend URL
- `VITE_DEFAULT_CLASS_LEVEL` - Default class

### Updated
- `backend/.env` - Already has CORS_ORIGINS set to http://localhost:5173

## Authentication Token Flow

```
1. User signs up/logs in
   ↓
2. Backend returns JWT token
   ↓
3. Frontend stores in localStorage.pathshala_auth
   ↓
4. Every API request:
   - Read token from localStorage
   - Add "Authorization: Bearer <token>" header
   ↓
5. Backend validates token
   ↓
6. Token expires after 24 hours
   ↓
7. User needs to re-login
```

## Testing the Connection

### Step 1: Backend Health
```bash
curl http://localhost:8000/health
# Response: {"status": "healthy"}
```

### Step 2: Signup
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
# Returns: token, user_id, email, etc.
```

### Step 3: Ask Question (Public)
```bash
curl -X POST http://localhost:8000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is photosynthesis?",
    "class": "10"
  }'
# Returns: answer, retrieved_chunks
```

### Step 4: Ask Question (Authenticated)
```bash
curl -X POST http://localhost:8000/api/rag/ask-auth \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_from_signup>" \
  -d '{
    "question": "What is photosynthesis?",
    "class": "10"
  }'
# Returns: answer with logging
```

## Verification Checklist

- [x] All API endpoints use `/api/` prefix
- [x] JWT tokens stored in localStorage
- [x] Authorization header auto-added
- [x] Signup form matches backend payload
- [x] Login function uses correct endpoint
- [x] AskDoubt calls correct API
- [x] Auth utilities updated
- [x] Environment variables configured
- [x] CORS configured for localhost:5173
- [x] Error handling improved

## Breaking Changes

⚠️ **Old code will NOT work**:
- Old endpoint paths (`/auth/signup` vs `/api/auth/signup`)
- Old session storage (`accessToken` vs `token`)
- Old API functions (`askDoubtRequest` vs `askQuestion`)
- Old login format (`user_type` vs `role`)

✅ **All code updated to new format**

## Next Steps

1. ✅ Start backend: `python app.py`
2. ✅ Start frontend: `npm run dev`
3. ✅ Test signup: Create new account
4. ✅ Test login: Login with credentials
5. ✅ Test Q&A: Ask a question (if ChromaDB populated)
6. ✅ Check localStorage: F12 → Application → Storage → Local Storage

---

**Integration Complete!** 🎉

All frontend components are now connected to the Flask backend with proper:
- JWT authentication
- API request formatting
- Error handling
- Data validation
- Storage management

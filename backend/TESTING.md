# Backend API Testing Guide

This guide helps you test the PathShala AI Backend API using PowerShell on Windows.

## Prerequisites

- Backend server running: `python app.py`
- Base URL: `http://localhost:8000`

## Testing Commands (PowerShell)

### 1. Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
```

### 2. Signup

```powershell
$signupData = @{
    role = "student"
    full_name = "Rahul Sharma"
    email = "rahul@example.com"
    password = "Password123"
    confirm_password = "Password123"
    gender = "Male"
    class = 10
    board = "CBSE"
    last_exam_marks = 85
    parent_email = "parent@example.com"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

$signup = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/signup" `
    -Method Post `
    -Body $signupData `
    -Headers $headers

$signup | ConvertTo-Json

# Save token for later use
$token = $signup.token
```

### 3. Login

```powershell
$loginData = @{
    email = "rahul@example.com"
    password = "Password123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

$login = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
    -Method Post `
    -Body $loginData `
    -Headers $headers

$login | ConvertTo-Json

# Save token
$token = $login.token
```

### 4. Get User Profile (Authenticated)

```powershell
# Use the token from login/signup
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/profile" `
    -Method Get `
    -Headers $headers | ConvertTo-Json
```

### 5. Ask a Question (No Auth)

```powershell
$questionData = @{
    question = "What is photosynthesis?"
    class = "10"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/rag/ask" `
    -Method Post `
    -Body $questionData `
    -Headers $headers

$response | ConvertTo-Json
```

### 6. Ask a Question (With Auth)

```powershell
$questionData = @{
    question = "What is photosynthesis?"
    class = "10"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/rag/ask-auth" `
    -Method Post `
    -Body $questionData `
    -Headers $headers

$response | ConvertTo-Json
```

### 7. Get Retrieval Stats (Debug)

```powershell
$questionData = @{
    question = "What is photosynthesis?"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/rag/retrieval-stats" `
    -Method Post `
    -Body $questionData `
    -Headers $headers

$response | ConvertTo-Json -Depth 10
```

### 8. Get Collection Info

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/rag/collection-info?class=10" `
    -Method Get | ConvertTo-Json
```

### 9. Record Lesson Progress (Authenticated)

```powershell
$progressData = @{
    class = "10"
    subject = "Science"
    chapter = "Chapter 1"
    topic = "Introduction"
    completed = $false
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/lessons/progress" `
    -Method Post `
    -Body $progressData `
    -Headers $headers | ConvertTo-Json
```

### 10. Get Progress (Authenticated)

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/lessons/progress" `
    -Method Get `
    -Headers $headers | ConvertTo-Json
```

### 11. Record Quiz Attempt (Authenticated)

```powershell
$quizData = @{
    class = "10"
    subject = "Science"
    chapter = "Chapter 1"
    score = 7
    total_questions = 10
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/lessons/quiz/attempt" `
    -Method Post `
    -Body $quizData `
    -Headers $headers | ConvertTo-Json
```

### 12. Get Quiz History (Authenticated)

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/lessons/quiz/history" `
    -Method Get `
    -Headers $headers | ConvertTo-Json
```

## Complete Test Script

Save this as `test_api.ps1`:

```powershell
# Configuration
$baseUrl = "http://localhost:8000"
$email = "test_$(Get-Random)@example.com"
$password = "TestPass123"

Write-Host "=" * 60
Write-Host "Testing PathShala AI Backend API"
Write-Host "=" * 60

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..."
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✓ Health check passed" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
    exit
}

# Test 2: Signup
Write-Host "`n2. Testing Signup..."
$signupData = @{
    role = "student"
    full_name = "Test User"
    email = $email
    password = $password
    confirm_password = $password
    gender = "Male"
    class = 10
    board = "CBSE"
    last_exam_marks = 80
    parent_email = "parent@example.com"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" `
        -Method Post `
        -Body $signupData `
        -ContentType "application/json"
    
    Write-Host "✓ Signup successful: User ID $(signup.user_id)" -ForegroundColor Green
    $token = $signup.token
} catch {
    Write-Host "✗ Signup failed: $_" -ForegroundColor Red
    exit
}

# Test 3: Ask Question
Write-Host "`n3. Testing Question Answering..."
$questionData = @{
    question = "What is photosynthesis?"
    class = "10"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/rag/ask" `
        -Method Post `
        -Body $questionData `
        -Headers $headers
    
    if ($response.success) {
        Write-Host "✓ Question answered successfully" -ForegroundColor Green
        Write-Host "  Answer preview: $($response.answer.Substring(0, 100))..." -ForegroundColor Gray
    } else {
        Write-Host "✗ Question failed: $($response.answer)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Question answered failed: $_" -ForegroundColor Red
}

# Test 4: Get Profile
Write-Host "`n4. Testing Get Profile..."
$authHeaders = @{
    "Authorization" = "Bearer $token"
}

try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" `
        -Method Get `
        -Headers $authHeaders
    
    Write-Host "✓ Profile retrieved successfully" -ForegroundColor Green
    Write-Host "  Name: $($profile.user.full_name)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Profile retrieval failed: $_" -ForegroundColor Red
}

Write-Host "`n" + "=" * 60
Write-Host "✓ All tests completed" -ForegroundColor Green
Write-Host "=" * 60
```

Run the script:
```powershell
.\test_api.ps1
```

## Troubleshooting

### Connection Refused
- Ensure backend server is running: `python app.py`
- Check if port 8000 is available

### JWT Token Invalid
- Token might have expired
- Re-login to get a fresh token
- Ensure token is copied without extra spaces

### ChromaDB Error
- Run: `python backend/chroma/ingest_ncert.py` first
- This creates the vector database from NCERT content

### Credential Issues
- Verify DATABASE_URL in .env
- Verify MONGO_URI in .env
- Ensure PostgreSQL and MongoDB are accessible

## Expected Test Results

All tests should pass with:
- ✓ Health check returns 200
- ✓ Signup creates user with token
- ✓ Login returns token
- ✓ Questions are answered (if ChromaDB is populated)
- ✓ Profile retrieved successfully
- ✓ Progress and quiz endpoints work with auth

For issues, check:
1. Server logs: `python app.py`
2. Database connections in `.env`
3. Network connectivity to PostgreSQL and MongoDB

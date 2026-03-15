"""
PostgreSQL connection and helper functions.
Manages connections to Railway PostgreSQL database.
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from config import DATABASE_URL


def get_conn():
    """
    Get a new PostgreSQL connection.
    """
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    return psycopg2.connect(DATABASE_URL, sslmode="require")


def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Execute a query and optionally fetch results.
    
    Args:
        query: SQL query string
        params: Tuple of parameters for the query
        fetch_one: If True, return one row
        fetch_all: If True, return all rows
    
    Returns:
        Query result or None
    """
    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(query, params or ())
        
        if fetch_one:
            result = cur.fetchone()
        elif fetch_all:
            result = cur.fetchall()
        else:
            result = None
        
        conn.commit()
        return result
    finally:
        cur.close()
        conn.close()


def init_db():
    """
    Initialize database tables. Run this once to set up the schema.
    """
    conn = get_conn()
    cur = conn.cursor()
    
    try:
        # Create users table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'parent')),
                full_name VARCHAR(120) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create student_profiles table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS student_profiles (
                user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                gender VARCHAR(20),
                class_level INT,
                board VARCHAR(50),
                last_exam_marks INT,
                parent_email VARCHAR(150)
            );
        """)
        
        # Create lesson_progress table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lesson_progress (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                class VARCHAR(10) NOT NULL,
                subject VARCHAR(50) NOT NULL,
                chapter VARCHAR(50) NOT NULL,
                topic VARCHAR(100),
                completed BOOLEAN DEFAULT FALSE,
                last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create quiz_attempts table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                class VARCHAR(10) NOT NULL,
                subject VARCHAR(50) NOT NULL,
                chapter VARCHAR(50) NOT NULL,
                score INT,
                total_questions INT,
                attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create sessions table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        print("✓ Database tables initialized successfully")
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

"""
User model for database operations.
Handles creation, retrieval, and validation of user accounts.
"""
from werkzeug.security import generate_password_hash, check_password_hash
from db.postgres import execute_query, get_conn


class User:
    """User model for authentication and profile management"""
    
    @staticmethod
    def create(full_name, email, password, role="student"):
        """
        Create a new user account.
        
        Args:
            full_name: User's full name
            email: User's email
            password: Plain text password (will be hashed)
            role: 'student' or 'parent'
        
        Returns:
            User ID if successful, None otherwise
        """
        password_hash = generate_password_hash(password)
        
        query = """
            INSERT INTO users (role, full_name, email, password_hash)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """
        
        try:
            result = execute_query(query, (role, full_name, email, password_hash), fetch_one=True)
            return result['id'] if result else None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    @staticmethod
    def get_by_id(user_id):
        """Get user by ID"""
        query = "SELECT id, role, full_name, email, created_at FROM users WHERE id = %s"
        return execute_query(query, (user_id,), fetch_one=True)
    
    @staticmethod
    def get_by_email(email):
        """Get user by email"""
        query = "SELECT id, role, full_name, email, created_at FROM users WHERE email = %s"
        return execute_query(query, (email,), fetch_one=True)
    
    @staticmethod
    def email_exists(email):
        """Check if email already exists"""
        user = User.get_by_email(email)
        return user is not None
    
    @staticmethod
    def verify_password(email, password):
        """
        Verify user password for login.
        
        Args:
            email: User's email
            password: Plain text password
        
        Returns:
            User record if password is correct, None otherwise
        """
        query = "SELECT id, role, password_hash FROM users WHERE email = %s"
        result = execute_query(query, (email,), fetch_one=True)
        
        if not result:
            return None
        
        if check_password_hash(result['password_hash'], password):
            return User.get_by_email(email)
        
        return None


class StudentProfile:
    """Student profile model for additional student information"""
    
    @staticmethod
    def create(user_id, gender=None, class_level=None, board=None, 
               last_exam_marks=None, parent_email=None):
        """
        Create student profile for a user.
        
        Args:
            user_id: The user's ID
            gender: Student's gender
            class_level: Class level (6-12)
            board: Education board (CBSE, etc.)
            last_exam_marks: Last exam score
            parent_email: Parent's email
        
        Returns:
            True if successful
        """
        query = """
            INSERT INTO student_profiles 
            (user_id, gender, class_level, board, last_exam_marks, parent_email)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        try:
            execute_query(query, (user_id, gender, class_level, board, last_exam_marks, parent_email))
            return True
        except Exception as e:
            print(f"Error creating student profile: {e}")
            return False
    
    @staticmethod
    def get_by_user_id(user_id):
        """Get student profile by user ID"""
        query = """
            SELECT user_id, gender, class_level, board, last_exam_marks, parent_email 
            FROM student_profiles WHERE user_id = %s
        """
        return execute_query(query, (user_id,), fetch_one=True)
    
    @staticmethod
    def update(user_id, **kwargs):
        """
        Update student profile fields.
        
        Args:
            user_id: The user's ID
            **kwargs: Fields to update (gender, class_level, board, etc.)
        
        Returns:
            True if successful
        """
        allowed_fields = {'gender', 'class_level', 'board', 'last_exam_marks', 'parent_email'}
        fields_to_update = {k: v for k, v in kwargs.items() if k in allowed_fields}
        
        if not fields_to_update:
            return False
        
        set_clause = ", ".join([f"{k} = %s" for k in fields_to_update.keys()])
        values = list(fields_to_update.values()) + [user_id]
        
        query = f"UPDATE student_profiles SET {set_clause} WHERE user_id = %s"
        
        try:
            execute_query(query, tuple(values))
            return True
        except Exception as e:
            print(f"Error updating student profile: {e}")
            return False

"""
Progress model for tracking student learning progress.
Handles lesson completion and quiz attempt records.
"""
from db.postgres import execute_query
from db.mongo import log_teaching_interaction
from datetime import datetime


class LessonProgress:
    """Track student lesson progress"""
    
    @staticmethod
    def record_progress(user_id, class_level, subject, chapter, topic=None, completed=False):
        """
        Record or update lesson progress for a student.
        
        Args:
            user_id: Student's user ID
            class_level: Class level
            subject: Subject name
            chapter: Chapter name
            topic: Optional specific topic
            completed: Whether the lesson was completed
        
        Returns:
            Progress ID if successful
        """
        query = """
            INSERT INTO lesson_progress 
            (user_id, class, subject, chapter, topic, completed, last_accessed)
            VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, class, subject, chapter) 
            DO UPDATE SET completed = %s, last_accessed = CURRENT_TIMESTAMP
            RETURNING id
        """
        
        try:
            result = execute_query(query, (user_id, class_level, subject, chapter, topic, completed, completed), fetch_one=True)
            
            # Log to MongoDB for analytics
            log_teaching_interaction(
                user_id=user_id,
                class_level=class_level,
                subject=subject,
                chapter=chapter,
                action="lesson_accessed",
                metadata={"topic": topic, "completed": completed}
            )
            
            return result['id'] if result else None
        except Exception as e:
            print(f"Error recording progress: {e}")
            return None
    
    @staticmethod
    def get_progress(user_id, class_level=None, subject=None):
        """
        Get lesson progress for a student.
        
        Args:
            user_id: Student's user ID
            class_level: Optional filter by class
            subject: Optional filter by subject
        
        Returns:
            List of progress records
        """
        query = "SELECT * FROM lesson_progress WHERE user_id = %s"
        params = [user_id]
        
        if class_level:
            query += " AND class = %s"
            params.append(class_level)
        
        if subject:
            query += " AND subject = %s"
            params.append(subject)
        
        query += " ORDER BY last_accessed DESC"
        
        try:
            return execute_query(query, tuple(params), fetch_all=True) or []
        except Exception as e:
            print(f"Error retrieving progress: {e}")
            return []
    
    @staticmethod
    def complete_lesson(user_id, class_level, subject, chapter):
        """Mark a lesson as completed"""
        return LessonProgress.record_progress(
            user_id, class_level, subject, chapter, completed=True
        )
    
    @staticmethod
    def get_completion_stats(user_id):
        """Get overall completion statistics for a student"""
        query = """
            SELECT 
                class,
                subject,
                COUNT(*) as total_chapters,
                SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_chapters
            FROM lesson_progress
            WHERE user_id = %s
            GROUP BY class, subject
        """
        
        try:
            return execute_query(query, (user_id,), fetch_all=True) or []
        except Exception as e:
            print(f"Error retrieving stats: {e}")
            return []


class QuizAttempt:
    """Track student quiz attempts and scores"""
    
    @staticmethod
    def record_attempt(user_id, class_level, subject, chapter, score, total_questions):
        """
        Record a quiz attempt.
        
        Args:
            user_id: Student's user ID
            class_level: Class level
            subject: Subject name
            chapter: Chapter name
            score: Score obtained
            total_questions: Total questions in the quiz
        
        Returns:
            Attempt ID if successful
        """
        query = """
            INSERT INTO quiz_attempts 
            (user_id, class, subject, chapter, score, total_questions)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        
        try:
            result = execute_query(query, (user_id, class_level, subject, chapter, score, total_questions), fetch_one=True)
            
            # Log to MongoDB for analytics
            percentage = (score / total_questions * 100) if total_questions > 0 else 0
            log_teaching_interaction(
                user_id=user_id,
                class_level=class_level,
                subject=subject,
                chapter=chapter,
                action="quiz_completed",
                metadata={"score": score, "total": total_questions, "percentage": percentage}
            )
            
            return result['id'] if result else None
        except Exception as e:
            print(f"Error recording quiz attempt: {e}")
            return None
    
    @staticmethod
    def get_attempts(user_id, class_level=None, subject=None, chapter=None):
        """
        Get quiz attempts for a student.
        
        Args:
            user_id: Student's user ID
            class_level: Optional filter
            subject: Optional filter
            chapter: Optional filter
        
        Returns:
            List of quiz attempts
        """
        query = "SELECT * FROM quiz_attempts WHERE user_id = %s"
        params = [user_id]
        
        if class_level:
            query += " AND class = %s"
            params.append(class_level)
        
        if subject:
            query += " AND subject = %s"
            params.append(subject)
        
        if chapter:
            query += " AND chapter = %s"
            params.append(chapter)
        
        query += " ORDER BY attempted_at DESC"
        
        try:
            return execute_query(query, tuple(params), fetch_all=True) or []
        except Exception as e:
            print(f"Error retrieving attempts: {e}")
            return []
    
    @staticmethod
    def get_average_score(user_id, class_level=None):
        """Get average quiz score for a student"""
        query = """
            SELECT 
                AVG(CAST(score AS FLOAT) / total_questions * 100) as average_percentage,
                COUNT(*) as total_attempts,
                MAX(CAST(score AS FLOAT) / total_questions * 100) as best_score,
                MIN(CAST(score AS FLOAT) / total_questions * 100) as worst_score
            FROM quiz_attempts
            WHERE user_id = %s
        """
        params = [user_id]
        
        if class_level:
            query += " AND class = %s"
            params.append(class_level)
        
        try:
            return execute_query(query, tuple(params), fetch_one=True)
        except Exception as e:
            print(f"Error calculating average: {e}")
            return None

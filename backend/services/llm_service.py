"""
LLM service layer for managing calls to HuggingFace API.
Handles prompt construction, model calls, and error handling.
"""
import requests
from config import HF_API_URL, HF_MODEL, HF_API_KEY, SYSTEM_PROMPT


class LLMService:
    """Service for Large Language Model interactions"""
    
    @staticmethod
    def generate_answer(question, context, system_prompt=None, max_tokens=300, temperature=0.2):
        """
        Generate an answer using HuggingFace API.
        
        Args:
            question: The question to answer
            context: Retrieved context/documents
            system_prompt: Optional custom system prompt
            max_tokens: Maximum tokens in response
            temperature: Temperature for generation (0.0-1.0)
        
        Returns:
            Generated answer or error message
        """
        if not HF_API_KEY:
            return "HF_API_KEY is missing. Add it in your environment to use Hugging Face."
        
        # Use provided system prompt or default
        sys_prompt = system_prompt or SYSTEM_PROMPT
        
        # Construct the full prompt
        prompt = f"""{sys_prompt}

Context:
{context}

Question:
{question}

Answer:"""
        
        return LLMService._call_api(prompt, max_tokens, temperature)
    
    @staticmethod
    def _call_api(prompt, max_tokens=300, temperature=0.2):
        """
        Internal method to call HuggingFace API.
        
        Args:
            prompt: Full prompt text
            max_tokens: Maximum tokens in response
            temperature: Generation temperature
        
        Returns:
            Generated text or error message
        """
        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": HF_MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        try:
            response = requests.post(
                HF_API_URL,
                headers=headers,
                json=payload,
                timeout=120
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Parse response
            if isinstance(data, dict):
                choices = data.get("choices", [])
                if choices:
                    message = choices[0].get("message", {})
                    content = message.get("content", "").strip()
                    if content:
                        return content
            
            return "LLM returned an unexpected response format."
        
        except requests.exceptions.Timeout:
            return "Request to LLM API timed out. Please try again."
        except requests.exceptions.ConnectionError:
            return "Failed to connect to LLM API. Please check your internet connection."
        except requests.exceptions.HTTPError as e:
            return f"LLM API error: {e.response.status_code} - {e.response.text}"
        except requests.RequestException as e:
            return f"Unexpected error calling LLM API: {str(e)}"
    
    @staticmethod
    def validate_answer(answer):
        """
        Simple validation check on answer.
        
        Args:
            answer: The generated answer
        
        Returns:
            True if answer appears valid, False otherwise
        """
        if not answer or len(answer.strip()) < 10:
            return False
        
        # Check for common error messages
        error_phrases = [
            "error",
            "failed",
            "cannot",
            "unable to",
            "not available"
        ]
        
        lower_answer = answer.lower()
        if any(phrase in lower_answer for phrase in error_phrases):
            return False
        
        return True

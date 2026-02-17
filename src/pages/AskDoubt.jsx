import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Mic,
    RotateCcw,
    Bot,
    User,
    Lightbulb,
    ListOrdered,
    Key,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import Button from '../components/ui/Button';
import './AskDoubt.css';

const AskDoubt = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: "Hello! I am your AI teacher. Ask me anything about your subjects -- I am here to help you understand concepts clearly. You can type your doubt or use voice input!",
            timestamp: '03:55 PM'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const formatTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputText,
            timestamp: formatTime()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                sender: 'ai',
                text: "Algebra uses letters (variables) like 'x' or 'y' to represent numbers we don't know yet. For example, in 'x + 5 = 10', 'x' is the unknown number. We solve it by finding what value of x makes the equation true (here, x = 5).",
                timestamp: formatTime()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ask-doubt-container">
            <div className="chat-section">
                <div className="chat-header">
                    <h1 className="chat-title">Ask a Doubt</h1>
                    <p className="chat-subtitle">Your AI teacher is ready to help you learn</p>
                </div>

                <div className="messages-list">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                            <div className={`avatar-circle ${msg.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                                {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className="message-content">
                                <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                                    {msg.text}
                                </div>
                                <div className="message-timestamp">{msg.timestamp}</div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-wrapper ai">
                            <div className="avatar-circle ai-avatar">
                                <Bot size={20} />
                            </div>
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <div className="input-controls">
                        <button className="mode-btn active">Text Mode</button>
                    </div>
                    <div className="input-box-wrapper">
                        <textarea
                            className="chat-input"
                            placeholder="Type your doubt here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <div className="input-actions">
                            <button className="icon-btn" title="Repeat">
                                <RotateCcw size={20} />
                            </button>
                            <button className="icon-btn microsphone active" title="Voice Input">
                                <Mic size={20} />
                            </button>
                            <button
                                className={`send-btn ${inputText.trim() ? 'active' : ''}`}
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="learning-aids-sidebar">
                <div className="aid-card">
                    <div className="aid-header">
                        <Lightbulb size={20} className="text-yellow-500" />
                        <h3 className="aid-title">Concept Explanation</h3>
                    </div>
                    <span className="aid-tag">Introduction to Algebra</span>
                    <p className="aid-content">
                        Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.
                    </p>
                </div>

                <div className="aid-card">
                    <div className="aid-header">
                        <ListOrdered size={20} className="text-blue-500" />
                        <h3 className="aid-title">Step-by-Step Solution</h3>
                    </div>
                    <ul className="aid-list">
                        <li>Algebra uses letters (variables) to represent unknown numbers.</li>
                        <li>An equation shows that two expressions are equal.</li>
                        <li>We solve equations by isolating the variable.</li>
                    </ul>
                </div>

                <div className="aid-card">
                    <div className="aid-header">
                        <Key size={20} className="text-purple-500" />
                        <h3 className="aid-title">Key Takeaways</h3>
                    </div>
                    <ul className="aid-list">
                        <li>Variables represent unknown values.</li>
                        <li>Equations must stay balanced.</li>
                    </ul>
                </div>

                <div className="feedback-card">
                    <h4 className="feedback-title">How well did you understand?</h4>
                    <div className="feedback-buttons">
                        <Button variant="outline" size="sm" className="feedback-btn negative">
                            <ThumbsDown size={16} /> Not clear
                        </Button>
                        <Button variant="outline" size="sm" className="feedback-btn positive">
                            <ThumbsUp size={16} /> Got it!
                        </Button>
                    </div>
                    <div className="confidence-slider-wrapper">
                        <label className="slider-label">Confidence: 50%</label>
                        <input type="range" min="0" max="100" defaultValue="50" className="confidence-range" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskDoubt;

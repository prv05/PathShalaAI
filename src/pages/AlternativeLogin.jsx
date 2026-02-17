import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowRight, Menu, ChevronDown, Sun, Moon, Globe, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import { validatePassword } from '../utils/validation';
import './AlternativeLogin.css';

const AlternativeLogin = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize from state if available, default to 'student'
    const [userType, setUserType] = useState(location.state?.userType || 'student');

    const [loginMethod, setLoginMethod] = useState('password');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const [language, setLanguage] = useState('ENG');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const languages = ['ENG', 'HIN', 'KAN'];

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (loginMethod === 'password') {
            if (!email || !password) {
                setError('Please enter both email and password.');
                return;
            }

            const validation = validatePassword(password);
            if (!validation.isValid) {
                setError(validation.error);
                return;
            }
        } else if (loginMethod === 'mobile') {
            if (!mobile) {
                setError('Please enter your mobile number.');
                return;
            }
        } else if (loginMethod === 'smart') {
            // Smart ID logic
        }

        // If validation passes, proceed
        console.log(`Logging in as ${userType} with:`, loginMethod);
        navigate('/dashboard');
    };

    return (
        <div className="ekool-login-container">
            <div className="ekool-card">
                {/* Header Section (Top of Card) */}
                <div className="ekool-header">
                    <div className="ekool-brand">
                        <GraduationCap size={24} className="ekool-logo-icon" />
                        <span className="ekool-brand-text">PathShala</span>
                    </div>



                    <div className="ekool-controls">
                        <button className="ekool-icon-btn" onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="ekool-lang-container">
                            <button
                                className="ekool-lang-pill"
                                onClick={() => setIsLangOpen(!isLangOpen)}
                            >
                                <Globe size={14} style={{ marginRight: '4px' }} />
                                <span>{language}</span>
                            </button>

                            {isLangOpen && (
                                <div className="ekool-lang-dropdown">
                                    {languages.map(lang => (
                                        <div
                                            key={lang}
                                            className="ekool-lang-option"
                                            onClick={() => {
                                                setLanguage(lang);
                                                setIsLangOpen(false);
                                            }}
                                        >
                                            {lang}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </div>
                </div>

                <div className="ekool-content-grid">
                    {/* LEFT COLUMN - Hero Section */}
                    <div className="ekool-hero-section">
                        <h1 className="ekool-hero-title">For an improved learning and teaching experience!</h1>


                        <div className="ekool-illustration-wrapper">
                            <div className="anim-particle p1"></div>
                            <div className="anim-particle p2"></div>
                            <div className="anim-particle p3"></div>
                            <img src="/src/assets/login_group_students.png" alt="Students group learning" className="illustration-group" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Login Form Panel */}
                    <div className="ekool-login-panel">


                        <div className="ekool-user-toggle">
                            <button
                                className={`ekool-toggle-btn ${userType === 'student' ? 'active' : ''}`}
                                onClick={() => {
                                    setUserType('student');
                                    setEmail('');
                                    setPassword('');
                                    setMobile('');
                                }}
                            >
                                Student
                            </button>
                            <button
                                className={`ekool-toggle-btn ${userType === 'parent' ? 'active' : ''}`}
                                onClick={() => {
                                    setUserType('parent');
                                    setEmail('');
                                    setPassword('');
                                    setMobile('');
                                }}
                            >
                                Parent
                            </button>
                        </div>

                        <h2 className="ekool-welcome-text">Welcome back, {userType === 'parent' ? 'Parent' : 'Student'}.</h2>

                        <div className="ekool-tabs">
                            <button
                                className={`ekool-tab ${loginMethod === 'password' ? 'active' : ''}`}
                                onClick={() => setLoginMethod('password')}
                            >
                                Password
                            </button>
                            <button
                                className={`ekool-tab ${loginMethod === 'mobile' ? 'active' : ''}`}
                                onClick={() => setLoginMethod('mobile')}
                            >
                                Mobile ID
                            </button>
                            <button
                                className={`ekool-tab ${loginMethod === 'smart' ? 'active' : ''}`}
                                onClick={() => setLoginMethod('smart')}
                            >
                                Smart ID
                            </button>
                        </div>

                        <form className="ekool-form" onSubmit={handleLogin}>
                            {error && <div className="ekool-error-message" style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
                            {loginMethod === 'password' && (
                                <>
                                    <div className="ekool-input-group">
                                        <label className="ekool-label">Email</label>
                                        <input
                                            type="email"
                                            className="ekool-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                        />
                                    </div>

                                    <div className="ekool-input-group">
                                        <label className="ekool-label">Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className="ekool-input"
                                                style={{ width: '100%', paddingRight: '40px' }}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#9CA3AF'
                                                }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <a href="#" className="ekool-forgot-link">Forgot?</a>
                                </>
                            )}

                            {loginMethod === 'mobile' && (
                                <div className="ekool-input-group">
                                    <label className="ekool-label">Mobile Number</label>
                                    <input
                                        type="tel"
                                        className="ekool-input"
                                        placeholder="+372"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            )}

                            {loginMethod === 'smart' && (
                                <div className="ekool-smart-instruction">
                                    Please connect your Smart ID card reader to continue.
                                </div>
                            )}

                            <button type="submit" className="ekool-login-btn">
                                Login
                            </button>
                        </form>

                        <div className="ekool-footer-link">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Create an account</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Scroll Indicator */}
                <div className="ekool-scroll-indicator">
                    <ChevronDown size={20} />
                </div>
            </div>
        </div>
    );
};

export default AlternativeLogin;

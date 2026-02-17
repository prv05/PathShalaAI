import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Globe, Eye, EyeOff } from 'lucide-react';
import { validatePassword } from '../utils/validation';
import './SignupPage.css';

// Reusing UI components or defining inline if simple, but better to use existing
// However, to ensure perfect matching with design required, I might need to style them specifically
// for this page or use the classes I just defined.
// SignupForm uses Input/Select from ui. Let's try to use standard HTML inputs styled with my new CSS
// to ensure it looks EXACTLY like AlternativeLogin (which uses <input className="ekool-input">).
// Integrating existing UI components might bring their own styles which could conflict or look different.
// So I will use raw <input> with my new classes to match AlternativeLogin's look 100%.

const SignupPage = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();

    // State
    const [userType, setUserType] = useState('student');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        classLevel: '',
        board: '',
        marks: '',
        mobile: '',
        childCount: '',
        childEmail: '',
        parentEmail: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [language, setLanguage] = useState('ENG');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const languages = ['ENG', 'HIN', 'KAN'];

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else {
            const passValidation = validatePassword(formData.password);
            if (!passValidation.isValid) newErrors.password = passValidation.error;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (userType === 'student') {
            if (!formData.gender) newErrors.gender = "Gender is required";
            if (!formData.classLevel) newErrors.classLevel = "Class is required";
            if (!formData.board) newErrors.board = "Board is required";
            if (!formData.marks.trim()) newErrors.marks = "Marks are required";
            if (!formData.parentEmail.trim()) newErrors.parentEmail = "Parent's Email is required";
            else if (!emailRegex.test(formData.parentEmail)) newErrors.parentEmail = "Invalid parent email format";
        }

        if (userType === 'parent') {
            if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
            else if (!mobileRegex.test(formData.mobile)) newErrors.mobile = "Invalid mobile number (10 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log("Signup Validated:", formData);
            // Navigate to dashboard or next step
            if (userType === 'student') navigate('/class-selection');
            else navigate('/dashboard');
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-card">
                {/* Header Nav */}
                <div className="signup-header-nav">
                    <div className="signup-brand">
                        <GraduationCap size={24} className="signup-logo-icon" />
                        <span className="signup-brand-text">PathShala</span>
                    </div>

                    <div className="signup-controls">
                        <button className="signup-icon-btn" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="signup-lang-container">
                            <button className="signup-lang-pill" onClick={() => setIsLangOpen(!isLangOpen)}>
                                <Globe size={14} style={{ marginRight: '4px' }} />
                                <span>{language}</span>
                            </button>
                            {isLangOpen && (
                                <div className="signup-lang-dropdown">
                                    {languages.map(lang => (
                                        <div key={lang} className="signup-lang-option"
                                            onClick={() => { setLanguage(lang); setIsLangOpen(false); }}>
                                            {lang}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="signup-content-grid">
                    {/* LEFT SECTION: Illustration */}
                    <div className="signup-hero-section">
                        <h1 className="signup-hero-title">Welcome to PathShala AI</h1>


                        <div className="signup-illustration-wrapper">
                            <div className="anim-particle p1"></div>
                            <div className="anim-particle p2"></div>
                            <div className="anim-particle p3"></div>
                            <img src="/src/assets/boy_blue.png" alt="Student Character" className="signup-illustration-img" />
                        </div>
                    </div>

                    {/* RIGHT SECTION: Form */}
                    <div className="signup-form-panel">
                        <h2 className="signup-welcome-text">Create Your Account</h2>
                        <p className="signup-subtext">Start your personalized learning journey today</p>

                        {/* User Type Toggle */}
                        <div className="signup-toggle-container">
                            <button
                                className={`signup-toggle-btn ${userType === 'student' ? 'active' : ''}`}
                                onClick={() => {
                                    setUserType('student');
                                    setFormData({
                                        fullName: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: '',
                                        gender: '',
                                        classLevel: '',
                                        board: '',
                                        marks: '',
                                        mobile: '',
                                        childCount: '',
                                        childEmail: '',
                                        parentEmail: ''
                                    });
                                }}
                            >
                                Student
                            </button>
                            <button
                                className={`signup-toggle-btn ${userType === 'parent' ? 'active' : ''}`}
                                onClick={() => {
                                    setUserType('parent');
                                    setFormData({
                                        fullName: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: '',
                                        gender: '',
                                        classLevel: '',
                                        board: '',
                                        marks: '',
                                        mobile: '',
                                        childCount: '',
                                        childEmail: '',
                                        parentEmail: ''
                                    });
                                }}
                            >
                                Parent
                            </button>
                        </div>

                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="signup-input-group">
                                <label className="signup-label">Full Name</label>
                                <input
                                    type="text"
                                    className="signup-input"
                                    placeholder="Enter full name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                {errors.fullName && <span className="signup-error-text">{errors.fullName}</span>}
                            </div>

                            <div className="signup-input-group">
                                <label className="signup-label">Email Address</label>
                                <input
                                    type="email"
                                    className="signup-input"
                                    placeholder="name@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="signup-error-text">{errors.email}</span>}
                            </div>

                            <div className="signup-row">
                                <div className="signup-input-group">
                                    <label className="signup-label">Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="signup-input"
                                            placeholder="••••••••"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ paddingRight: '35px' }}
                                        />
                                        <button type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF'
                                            }}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <span className="signup-error-text">{errors.password}</span>}
                                </div>
                                <div className="signup-input-group">
                                    <label className="signup-label">Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="signup-input"
                                            placeholder="••••••••"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            style={{ paddingRight: '35px' }}
                                        />
                                        <button type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{
                                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF'
                                            }}>
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <span className="signup-error-text">{errors.confirmPassword}</span>}
                                </div>
                            </div>

                            {userType === 'student' && (
                                <>
                                    <div className="signup-row">
                                        <div className="signup-input-group">
                                            <label className="signup-label">Gender</label>
                                            <select
                                                className="signup-input"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <span className="signup-error-text">{errors.gender}</span>}
                                        </div>
                                        <div className="signup-input-group">
                                            <label className="signup-label">Class</label>
                                            <select
                                                className="signup-input"
                                                name="classLevel"
                                                value={formData.classLevel}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Class</option>
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i} value={i + 1}>Class {i + 1}</option>
                                                ))}
                                            </select>
                                            {errors.classLevel && <span className="signup-error-text">{errors.classLevel}</span>}
                                        </div>
                                    </div>

                                    <div className="signup-row">
                                        <div className="signup-input-group">
                                            <label className="signup-label">Board</label>
                                            <select
                                                className="signup-input"
                                                name="board"
                                                value={formData.board}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Board</option>
                                                <option value="cbse">CBSE</option>
                                                <option value="icse">ICSE</option>
                                                <option value="state">State Board</option>
                                            </select>
                                            {errors.board && <span className="signup-error-text">{errors.board}</span>}
                                        </div>
                                        <div className="signup-input-group">
                                            <label className="signup-label">Last Exam Marks</label>
                                            <input
                                                type="text"
                                                className="signup-input"
                                                placeholder="e.g. 85%"
                                                name="marks"
                                                value={formData.marks}
                                                onChange={handleChange}
                                            />
                                            {errors.marks && <span className="signup-error-text">{errors.marks}</span>}
                                        </div>
                                    </div>

                                    <div className="signup-input-group">
                                        <label className="signup-label">Parent's Email ID</label>
                                        <input
                                            type="email"
                                            className="signup-input"
                                            placeholder="parent@example.com"
                                            name="parentEmail"
                                            value={formData.parentEmail || ''}
                                            onChange={handleChange}
                                        />
                                        {errors.parentEmail && <span className="signup-error-text">{errors.parentEmail}</span>}
                                    </div>
                                </>
                            )}

                            {userType === 'parent' && (
                                <>
                                    <div className="signup-input-group">
                                        <label className="signup-label">Mobile Number</label>
                                        <input
                                            type="tel"
                                            className="signup-input"
                                            placeholder="+91"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                        />
                                        {errors.mobile && <span className="signup-error-text">{errors.mobile}</span>}
                                    </div>
                                </>
                            )}

                            <button type="submit" className="signup-btn">
                                Create Account
                            </button>
                        </form>

                        <div className="signup-footer-link">
                            Already have an account? <a onClick={() => navigate('/login-alt')}>Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

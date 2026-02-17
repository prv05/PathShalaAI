import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { validatePassword } from '../utils/validation';
import './SignupForm.css';

const SignupForm = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('student'); // 'student' or 'parent'
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        classLevel: '',
        language: '',
        parentEmail: '',
        mobile: '',
        childCount: '',
        childEmail: '',
        gender: '',
        board: '',
        marks: '',
        schoolName: ''
    });

    const [passwordError, setPasswordError] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'password') {
            const validation = validatePassword(value);
            setPasswordError(validation.isValid ? '' : validation.error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
            setPasswordError(validation.error);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match!");
            return;
        }

        console.log(`Form Submitted (${userType}):`, formData);
        if (userType === 'student') {
            navigate('/class-selection');
        } else {
            // Parent flow might go somewhere else, for now just log or go to dashboard/login
            navigate('/login-alt'); // Redirect to login or parent dashboard
        }
    };

    const classOptions = Array.from({ length: 10 }, (_, i) => ({
        value: `class-${i + 1}`,
        label: `Class ${i + 1}`
    }));

    const languageOptions = [
        { value: 'english', label: 'English' },
        { value: 'kannada', label: 'Kannada' },
        { value: 'hindi', label: 'Hindi' }
    ];

    return (
        <div className="signup-wrapper">
            <div className="signup-container">

                <div className="signup-header">
                    <h1 className="signup-title">Create Your {userType === 'parent' ? 'Parent' : ''} Account</h1>
                    <p className="signup-subtitle">Start your personalized learning journey today</p>
                </div>

                {/* User Type Toggle */}
                <div className="user-type-toggle">
                    <button
                        className={`toggle-btn ${userType === 'student' ? 'active' : ''}`}
                        onClick={() => setUserType('student')}
                        type="button"
                    >
                        Student
                    </button>
                    <button
                        className={`toggle-btn ${userType === 'parent' ? 'active' : ''}`}
                        onClick={() => setUserType('parent')}
                        type="button"
                    >
                        Parent
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                    <Input
                        label="Full Name"
                        placeholder="Aarav Sharma"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="aarav@email.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-row">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={showPassword ? EyeOff : Eye}
                            onIconClick={() => setShowPassword(!showPassword)}
                            required
                            wrapperClassName="flex-1"
                            error={passwordError}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            wrapperClassName="flex-1"
                        />
                    </div>

                    {userType === 'student' && (
                        <>
                            <Select
                                label="Gender"
                                placeholder="Select Gender"
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' }
                                ]}
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            />

                            <div className="form-row">
                                <Select
                                    label="Select Class"
                                    placeholder="Class"
                                    options={classOptions}
                                    name="classLevel"
                                    value={formData.classLevel}
                                    onChange={handleChange}
                                    required
                                />

                                <Select
                                    label="Board"
                                    placeholder="Select Board"
                                    options={[
                                        { value: 'cbse', label: 'CBSE' },
                                        { value: 'icse', label: 'ICSE' },
                                        { value: 'state', label: 'State Board' }
                                    ]}
                                    name="board"
                                    value={formData.board}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Input
                                label="Marks / Grades (Last Exam)"
                                placeholder="e.g. 85% or A Grade"
                                name="marks"
                                value={formData.marks}
                                onChange={handleChange}
                                required
                            />

                            <Select
                                label="Preferred Language"
                                placeholder="Select Language"
                                options={languageOptions}
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="School Name (Optional)"
                                placeholder="Enter school name"
                                name="schoolName"
                                value={formData.schoolName}
                                onChange={handleChange}
                            />

                            <Input
                                label="Parent Email (Optional)"
                                type="email"
                                placeholder="Link parent account"
                                name="parentEmail"
                                value={formData.parentEmail}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    {userType === 'parent' && (
                        <>
                            <Input
                                label="Mobile Number"
                                type="tel"
                                placeholder="Enter mobile number"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Number of Children (Optional)"
                                type="number"
                                placeholder="How many children?"
                                name="childCount"
                                value={formData.childCount}
                                onChange={handleChange}
                            />
                            <Input
                                label="Child Email / ID (Optional)"
                                type="text"
                                placeholder="Link child account"
                                name="childEmail"
                                value={formData.childEmail}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        className="mt-4"
                    >
                        <Sparkles size={20} />
                        Create Account
                    </Button>
                </form>

                <div className="signup-footer">
                    Already have an account? <span className="link" onClick={() => navigate('/login-alt', { state: { userType } })} style={{ cursor: 'pointer' }}>Log In</span>
                </div>
            </div>

            {/* Side Image */}
            <div className="signup-image-container">
                <img src="/src/assets/boy_blue.png" alt="Student" className="signup-image" />
            </div>
        </div>
    );
};

export default SignupForm;

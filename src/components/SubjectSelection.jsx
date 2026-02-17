import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, FlaskConical, BookOpen, Globe, Monitor, Megaphone } from 'lucide-react';
import StepIndicator from './StepIndicator';
import Button from './ui/Button';
import './SubjectSelection.css';

const SubjectSelection = () => {
    const navigate = useNavigate();
    // Using an array for multiple selection, default EVS selected (id 6)
    const [selectedSubjects, setSelectedSubjects] = useState([6]);

    const subjects = [
        { id: 1, name: 'Mathematics', type: 'Core', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900', borderColor: 'border-blue-200' },
        { id: 2, name: 'Science', type: 'Core', icon: FlaskConical, color: 'text-green-500', bg: 'bg-green-100', darkBg: 'dark:bg-green-900', borderColor: 'border-green-200' },
        { id: 3, name: 'English', type: 'Language', icon: BookOpen, color: 'text-yellow-500', bg: 'bg-yellow-100', darkBg: 'dark:bg-yellow-900', borderColor: 'border-yellow-200' },
        { id: 4, name: 'Social Science', type: 'Core', icon: Globe, color: 'text-pink-500', bg: 'bg-pink-100', darkBg: 'dark:bg-pink-900', borderColor: 'border-pink-200' },
        { id: 5, name: 'Computer Science', type: 'Core', icon: Monitor, color: 'text-orange-500', bg: 'bg-orange-100', darkBg: 'dark:bg-orange-900', borderColor: 'border-orange-200' },
        { id: 6, name: 'EVS', type: 'Core', icon: Megaphone, color: 'text-teal-500', bg: 'bg-teal-100', darkBg: 'dark:bg-teal-900', borderColor: 'border-teal-200' },
    ];

    const handleSubjectSelect = (id) => {
        if (selectedSubjects.includes(id)) {
            setSelectedSubjects(selectedSubjects.filter(sid => sid !== id));
        } else {
            setSelectedSubjects([...selectedSubjects, id]);
        }
    };

    const handleBack = () => {
        navigate('/class-selection');
    };

    const handleContinue = () => {
        console.log('Selected Subjects:', selectedSubjects);
        navigate('/dashboard');
    };

    return (
        <div className="page-container">
            <StepIndicator currentStep={3} />

            <div className="selection-header">
                <h1 className="selection-title">Select Your Subjects</h1>
                <p className="selection-subtitle">Choose the subjects you want to learn. You can always change this later.</p>
            </div>

            <div className="subject-grid">
                {subjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    const Icon = subject.icon;

                    return (
                        <div
                            key={subject.id}
                            className={`subject-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSubjectSelect(subject.id)}
                        >
                            <div className={`subject-icon-wrapper ${subject.color.replace('text-', 'bg-').replace('500', '100')}`}>
                                <Icon size={32} className={subject.color} />
                            </div>
                            <div className="subject-info">
                                <h3 className="subject-name">{subject.name}</h3>
                                <span className="subject-type">{subject.type}</span>
                            </div>
                            {isSelected && <div className="subject-check">✓</div>}
                        </div>
                    );
                })}
            </div>

            <div className="action-buttons">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleContinue}>Continue to Lessons</Button>
            </div>
        </div>
    );
};

export default SubjectSelection;

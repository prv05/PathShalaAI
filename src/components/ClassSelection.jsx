import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import Button from './ui/Button';
import './ClassSelection.css';

const ClassSelection = () => {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState(7); // Default to 7 as per request

    const classes = Array.from({ length: 10 }, (_, i) => i + 1);

    const handleClassSelect = (classNum) => {
        setSelectedClass(classNum);
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleContinue = () => {
        if (selectedClass) {
            navigate('/subject-selection');
        }
    };

    return (
        <div className="page-container">
            <StepIndicator currentStep={2} />

            <div className="selection-header">
                <h1 className="selection-title">Select Your Class</h1>
                <p className="selection-subtitle">Choose your class to get personalized lessons aligned with CBSE curriculum</p>
            </div>

            <div className="class-grid">
                {classes.map((num) => (
                    <div
                        key={num}
                        className={`class-card ${selectedClass === num ? 'selected' : ''}`}
                        onClick={() => handleClassSelect(num)}
                    >
                        <div className="class-number">{num}</div>
                        <div className="class-type">CBSE</div>
                    </div>
                ))}
            </div>

            <div className="action-buttons">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleContinue}>Continue</Button>
            </div>
        </div>
    );
};

export default ClassSelection;

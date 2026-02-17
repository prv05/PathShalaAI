import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep }) => {
    const steps = [1, 2, 3, 4];

    return (
        <div className="step-indicator-container">
            {steps.map((step, index) => (
                <div key={step} className="step-wrapper">
                    {/* Connecting Line */}
                    {index > 0 && (
                        <div
                            className={`step-line ${step <= currentStep ? 'active' : ''}`}
                        />
                    )}

                    {/* Step Circle */}
                    <div
                        className={`step-circle ${step <= currentStep ? 'active' : ''} ${step === currentStep ? 'current' : ''}`}
                    >
                        {step}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;

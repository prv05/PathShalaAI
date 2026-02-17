import React from 'react';
import './ui.css';

const Input = ({
    label,
    icon: Icon,
    onIconClick,
    className = '',
    wrapperClassName = '',
    error,
    ...props
}) => {
    return (
        <div className={`input-group ${wrapperClassName}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                <input
                    className={`input-field ${error ? 'error' : ''} ${className}`}
                    {...props}
                />
                {Icon && (
                    <div className="input-icon" onClick={onIconClick}>
                        <Icon size={20} />
                    </div>
                )}
            </div>
            {error && <div className="input-error-message">{error}</div>}
        </div>
    );
};

export default Input;

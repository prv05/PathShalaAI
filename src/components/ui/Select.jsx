import React from 'react';
import './ui.css';

const Select = ({
    label,
    options = [],
    placeholder = 'Select option',
    className = '',
    ...props
}) => {
    return (
        <div className="select-group">
            {label && <label className="input-label">{label}</label>}
            <select className={`select-field ${className}`} {...props}>
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;

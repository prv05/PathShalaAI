import React from 'react';
import './ui.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-primary';
  const sizeClass = size === 'lg' ? 'btn-lg' : '';
  const widthClass = fullWidth ? 'btn-full' : '';

  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

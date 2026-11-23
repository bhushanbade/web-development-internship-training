import React from 'react';
import './Button.css';

/**
 * Reusable Button component.
 * Demonstrates: Props (variant, size, onClick, icon, children, disabled) and Event handling.
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon: Icon = null,
  disabled = false,
  type = 'button',
  className = ''
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="btn__icon" size={size === 'small' ? 14 : 18} />}
      <span>{children}</span>
    </button>
  );
}

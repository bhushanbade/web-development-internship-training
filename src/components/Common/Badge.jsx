import React from 'react';
import './Badge.css';

/**
 * Reusable Badge component for status, priority, and tags.
 * Demonstrates: Props (variant, children, size) and conditional class composition.
 */
export default function Badge({ children, variant = 'neutral', size = 'medium' }) {
  const badgeClass = `badge badge--${variant} badge--${size}`;
  
  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
}

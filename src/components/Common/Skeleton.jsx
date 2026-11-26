import React from 'react';
import './Skeleton.css';

/**
 * Skeleton Loader Component — Demonstrates Loading UI State.
 * Displays pulsing placeholder shapes while asynchronous data is in transit.
 */
export default function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = ''
}) {
  const elements = Array.from({ length: count }, (_, idx) => (
    <div
      key={idx}
      className={`skeleton skeleton--${variant} ${className}`}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1rem' : variant === 'avatar' ? '40px' : '3.5rem')
      }}
    />
  ));

  return count === 1 ? elements[0] : <div className="skeleton-group">{elements}</div>;
}

/**
 * Compound Skeleton Row specifically for task tables.
 */
export function SkeletonTaskRow() {
  return (
    <tr className="skeleton-task-row">
      <td style={{ width: '50px' }}><Skeleton variant="avatar" width="22px" height="22px" /></td>
      <td>
        <Skeleton variant="text" width="70%" height="1.1rem" style={{ marginBottom: '6px' }} />
        <Skeleton variant="text" width="40%" height="0.8rem" />
      </td>
      <td style={{ width: '120px' }}><Skeleton variant="pill" width="80px" height="24px" /></td>
      <td style={{ width: '130px' }}><Skeleton variant="text" width="90px" height="0.9rem" /></td>
      <td style={{ width: '90px' }}><Skeleton variant="pill" width="65px" height="24px" /></td>
      <td style={{ width: '110px' }}><Skeleton variant="text" width="85px" height="0.9rem" /></td>
      <td style={{ width: '60px' }}><Skeleton variant="avatar" width="28px" height="28px" /></td>
    </tr>
  );
}

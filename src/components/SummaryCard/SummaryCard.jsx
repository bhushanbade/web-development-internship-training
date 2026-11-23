import React from 'react';
import './SummaryCard.css';

/**
 * Reusable Summary Card component.
 * Demonstrates:
 * - Props receiving (title, value, change, changeType, icon, trendLabel)
 * - Conditional rendering and class assignment
 * - Component composition and clean markup
 */
export default function SummaryCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  trendLabel = 'vs last period',
  accentColor = '#3b82f6'
}) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="summary-card">
      <div className="summary-card__header">
        <span className="summary-card__title">{title}</span>
        {Icon && (
          <div 
            className="summary-card__icon-wrapper" 
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="summary-card__body">
        <span className="summary-card__value">{value}</span>
      </div>

      <div className="summary-card__footer">
        {change && (
          <span className={`summary-card__trend summary-card__trend--${changeType}`}>
            {isPositive && '↑ '}
            {isNegative && '↓ '}
            {change}
          </span>
        )}
        {trendLabel && <span className="summary-card__trend-label">{trendLabel}</span>}
      </div>
    </div>
  );
}

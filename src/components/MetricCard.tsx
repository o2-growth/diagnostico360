
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface MetricCardProps {
  title: string;
  value: number;
  color: string;
}

const MetricCard = ({ title, value, color }: MetricCardProps) => {
  const isLightMode = document.documentElement.classList.contains('light');
  
  return (
    <div className="metric-card">
      <div className="relative w-32 h-32 mb-6">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: '1.25rem',
            pathColor: color,
            textColor: isLightMode ? '#403E43' : color,
            trailColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
          })}
        />
      </div>
      <h3 className="text-lg font-medium text-dashboard-text">{title}</h3>
    </div>
  );
};

export default MetricCard;

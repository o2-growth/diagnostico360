
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface MetricCardProps {
  value: number;
  color: string;
  title?: string;
}

const MetricCard = ({ value, color }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="relative w-48 h-48">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: '1.5rem',
            pathColor: color,
            textColor: color,
            trailColor: 'rgba(255,255,255,0.1)',
          })}
        />
      </div>
    </div>
  );
};

export default MetricCard;

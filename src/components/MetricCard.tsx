
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '@/components/theme/theme-provider';

interface MetricCardProps {
  title: string;
  value: number;
  color: string;
}

const MetricCard = ({ title, value, color }: MetricCardProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="metric-card group hover:scale-[1.02]">
      <div className="relative w-32 h-32 mb-6 transition-transform duration-300 group-hover:scale-105">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: '1.25rem',
            pathColor: color,
            textColor: color,
            trailColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            pathTransitionDuration: 0.8,
          })}
        />
      </div>
      <h3 className="text-lg font-medium text-dashboard-text">{title}</h3>
    </div>
  );
};

export default MetricCard;

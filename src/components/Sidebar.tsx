import React from 'react';
import '../styles/Sidebar.css';

interface SidebarProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  bestTimes: Record<number, number | null>;
  games: number;
  onRestart?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  gridSize, 
  onGridSizeChange, 
  bestTimes, 
  games
}) => {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '-';
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Schulte Table</h1>
        <p>Improve fast reading &<br />attention</p>
      </div>

      <div className="grid-size-control">
        <h2>Grid Size</h2>
        <div className="grid-size-buttons">
          {[3, 4, 5, 6, 7, 8, 9].map(size => (
            <button 
              key={size}
              className={`grid-size-button ${size === gridSize ? 'active' : ''}`}
              onClick={() => onGridSizeChange(size)}
            >
              {size}x{size}
            </button>
          ))}
          <div className="down-arrow">↓</div>
        </div>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Best Time</span>
          <span className="stat-value">{formatTime(bestTimes[gridSize])}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Games</span>
          <span className="stat-value">{games}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
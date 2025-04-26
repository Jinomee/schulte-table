import React, { useState } from 'react';
import './App.css';
import SchulteTable from './components/SchulteTable';
import Sidebar from './components/Sidebar';

function App() {
  const [gridSize, setGridSize] = useState<number>(6);
  const [gamesPerSize, setGamesPerSize] = useState<Record<number, number>>({
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0
  });
  const [bestTimes, setBestTimes] = useState<Record<number, number | null>>({
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null
  });
  const [key, setKey] = useState<number>(0); // Used to force re-render of SchulteTable

  const handleGridSizeChange = (size: number) => {
    // Only update if the size is actually changing
    if (size !== gridSize) {
      setGridSize(size);
      setKey(prevKey => prevKey + 1);
    }
  };

  const handleGameComplete = (time: number) => {
    // Ensure time has consistent precision
    const finalTime = parseFloat(time.toFixed(2));
    
    // Increment game count for the current grid size
    setGamesPerSize(prevGames => ({
      ...prevGames,
      [gridSize]: prevGames[gridSize] + 1
    }));
    
    // Update best time if it's better than previous record or first completion
    setBestTimes(prevTimes => {
      const currentBest = prevTimes[gridSize];
      if (currentBest === null || finalTime < currentBest) {
        return { ...prevTimes, [gridSize]: finalTime };
      }
      return prevTimes;
    });
  };

  return (
    <div className="app">
      <Sidebar 
        gridSize={gridSize} 
        onGridSizeChange={handleGridSizeChange}
        bestTimes={bestTimes}
        games={gamesPerSize[gridSize]}
      />
      <main className="main-content">
        <SchulteTable 
          key={key}
          size={gridSize} 
          onGameComplete={handleGameComplete}
        />
      </main>
    </div>
  );
}

export default App;

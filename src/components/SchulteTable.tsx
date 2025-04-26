import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/SchulteTable.css';

interface SchulteTableProps {
  size: number;
  onGameComplete: (timeInSeconds: number) => void;
}

const SchulteTable: React.FC<SchulteTableProps> = ({ size, onGameComplete }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const gameStartedRef = useRef<boolean>(false);
  const prevSizeRef = useRef<number>(size);

  // Generate random numbers for the grid
  const generateNumbers = useCallback(() => {
    const nums = Array.from({ length: size * size }, (_, i) => i + 1);
    // Shuffle the array
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  }, [size]);

  // Initialize the game when size changes
  useEffect(() => {
    // Only regenerate numbers if the size changed or if the game hasn't started
    if (prevSizeRef.current !== size || !gameStartedRef.current) {
      const newNumbers = generateNumbers();
      setNumbers(newNumbers);
      setCurrentNumber(1);
      setStartTime(null);
      setElapsedTime(0);
      setIsComplete(false);
      gameStartedRef.current = false;
      
      // Clear any existing interval
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      prevSizeRef.current = size;
    }
  }, [size, generateNumbers, timerInterval]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Start the timer when the first number is clicked
  const startTimer = () => {
    if (startTime === null) {
      const now = Date.now();
      setStartTime(now);
      gameStartedRef.current = true;
      
      const interval = setInterval(() => {
        const newTime = (Date.now() - now) / 1000;
        setElapsedTime(parseFloat(newTime.toFixed(2))); // Ensure consistent precision
      }, 10);
      
      setTimerInterval(interval);
    }
  };

  // Handle number click
  const handleNumberClick = (number: number) => {
    if (number === currentNumber) {
      // Start timer on first click
      if (currentNumber === 1) {
        startTimer();
      }
      
      // Check if this is the last number
      if (currentNumber === size * size) {
        // Game complete
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        setIsComplete(true);
        // Calculate final time with consistent precision
        const finalTime = parseFloat(((Date.now() - (startTime || Date.now())) / 1000).toFixed(2));
        onGameComplete(finalTime);
      } else {
        // Move to next number
        setCurrentNumber(prevNumber => prevNumber + 1);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    return `${seconds.toFixed(2)}s`;
  };

  const handleRestart = () => {
    const newNumbers = generateNumbers();
    setNumbers(newNumbers);
    setCurrentNumber(1);
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    gameStartedRef.current = false;
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  return (
    <div className="schulte-container">
      <div className="schulte-header">
        <div className="schulte-info">Next: {isComplete ? "Done!" : currentNumber}</div>
        <div className="schulte-info time">{formatTime(elapsedTime)}</div>
      </div>
      <div 
        className="schulte-grid" 
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
        }}
      >
        {numbers.map((number, index) => (
          <div 
            key={`${index}-${number}`}
            className={`schulte-cell ${number < currentNumber ? 'completed' : ''}`}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </div>
        ))}
      </div>
      <div className="game-instructions">
        Click on numbers from 1 to {size*size} in ascending order
      </div>
      <div className="restart-area">
        <button className="restart-button-text" onClick={handleRestart}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default SchulteTable; 
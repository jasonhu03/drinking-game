import React, { useState, useEffect, useRef} from 'react';
import './App.css';

const FILL_SPEED = 20; // ms per percentage point
const PERFECT_RANGE = [95, 105]; // percentage range for perfect pour
  
export default function DrinkPourGame() {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [currStatus, setCurrStatus] = useState('Pour a Drink');

  const fillRef = useRef(0);
  const isIdleRef = useRef(true);

  useEffect(() => {
    fillRef.current = fillPercentage;
    isIdleRef.current = isIdle;
  }, [fillPercentage, isIdle]);

  // Handle spacebar press and release
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isIdleRef.current) {
        e.preventDefault();
        setIsPouring(true);
        setIsIdle(false);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPouring(false);
        if (fillRef.current > PERFECT_RANGE[0] && fillRef.current <= PERFECT_RANGE[1]) {
          setCurrentScore((prev) => prev + 2);
          setCurrStatus('Perfect Pour!');
        }
        else if (fillRef.current > 50) {
          setCurrentScore((prev) => prev + 1);
          setCurrStatus('Good!');
        }
        else if (fillRef.current > 0) {
          setCurrentScore((prev) => prev - 1);
          setCurrStatus('Too Little!');
        }
        setFillPercentage(0);
        setIsIdle(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Fill cup when spacebar is held
  useEffect(() => {
    if (!isPouring) return;

    const interval = setInterval(() => {
      setFillPercentage((prev) => {
        const newFill = prev + 1;
        if (fillRef.current > PERFECT_RANGE[1]) {
          setIsPouring(false);
          setCurrStatus('Overfilled!');
          setFillPercentage(0);
          setCurrentScore((prev) => prev - 1);
          return 0;
        }
        return newFill;
      });
    }, FILL_SPEED);

    return () => clearInterval(interval);
  }, [isPouring]);

  return (
    <div className="container">
      <div className="status">{currStatus}</div>
      <div className="score">Score: {currentScore}</div>
      {/* Cup */}
      <div className="cup">
        {/* Liquid */}
        <div
          className="liquid"
          style={{ height: `${fillPercentage}%` }}
        />
      </div>

      {/* Percentage Display */}
      <p className="percentage">{fillPercentage}%</p>

      {/* Instructions */}
      <p className="instructions">Hold SPACEBAR to pour</p>
    </div>
  );
}
import React, { useState, useEffect, useRef} from 'react';
import './App.css';

const FILL_SPEED = 20; // ms per percentage point
const PERFECT_RANGE = [95, 105]; // percentage range for perfect pour
const TIME_TO_POUR = 5; // seconds to pour each drink before failing
  
export default function DrinkPourGame() {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [currStatus, setCurrStatus] = useState('Pour a Drink');
  const [timeRemaining, setTimeRemaining] = useState(TIME_TO_POUR);
  const [hearts, setHeartsRemaining] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const fillRef = useRef(0);
  const isIdleRef = useRef(true);

  useEffect(() => {
    fillRef.current = fillPercentage;
    isIdleRef.current = isIdle;
  }, [fillPercentage, isIdle]);

  // Handle spacebar press and release
  useEffect(() => {
    if (gameOver) return;
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
          setTimeRemaining(10);
          setCurrStatus('Perfect Pour!');
        }
        else if (fillRef.current > 50) {
          setCurrentScore((prev) => prev + 1);
          setTimeRemaining(10);
          setCurrStatus('Good!');
        }
        else if (fillRef.current > 0) {
          //setCurrentScore((prev) => prev - 1);
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

  //Timer countdown
  useEffect(() => {
    if (gameOver) return;
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsPouring(false);
          setCurrStatus('Time\'s Up!');
          setHeartsRemaining((prev) => {
            const newHearts = prev - 0.5;
              if (newHearts <= 0) {
                setCurrStatus('Game Over!');
                setGameOver(true);
              }
              return newHearts;});
          setIsIdle(true);
          setFillPercentage(0);
          return TIME_TO_POUR; // reset timer
        }
        return prev - 1;
      });
    }, 1000); // 1 second

    return () => clearInterval(timerInterval);
  }, [gameOver]);

  // Fill cup when spacebar is held
  useEffect(() => {
    if (gameOver) return;
    if (!isPouring) return;

    const interval = setInterval(() => {
      setFillPercentage((prev) => {
        const newFill = prev + 1;
        if (fillRef.current > PERFECT_RANGE[1]) {
          setIsPouring(false);
          setCurrStatus('Overfilled!');
          //setCurrentScore((prev) => prev - .5);
          return 0;
        }
        return newFill;
      });
    }, FILL_SPEED);

    return () => clearInterval(interval);
  }, [isPouring]);

  
  return (
    <div className="container">
      <div className="lives-counter">
        {/* {[...Array(hearts)].map((_, i) => (
          <div key={i} className="heart">❤️</div>
        ))} */}
        <div className="score">{hearts}</div>
      </div>
      <div className="status">{currStatus}</div>
      <div className="score">Score: {currentScore}</div>
      <div className="timer">{timeRemaining}s</div>
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
      {gameOver && (
      <div className="game-over-screen">
        <div className="game-over-content">
          <h1>Game Over!</h1>
          <p>Final Score: {currentScore}</p>
          <button onClick={() => {
            setGameOver(false);
            setCurrentScore(0);
            setHeartsRemaining(3);
            setTimeRemaining(TIME_TO_POUR);
            setCurrStatus('Pour a Drink');
            setFillPercentage(0);
            setIsIdle(true);
          }}>
            Play Again
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature({ category }) {
  // Icon declarations
  const BrainIcon = getIcon('Brain');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const RefreshCwIcon = getIcon('RefreshCw');
  const InfoIcon = getIcon('Info');
  const TimerIcon = getIcon('Timer');
  const ArrowRightIcon = getIcon('ArrowRight');
  const TrophyIcon = getIcon('Trophy');
  const HeartIcon = getIcon('Heart');
  const AwardIcon = getIcon('Award');
  
  // State variables
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzle, setPuzzle] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [gameState, setGameState] = useState('setup'); // setup, playing, success, failed
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Generate puzzle based on category and difficulty
  useEffect(() => {
    setLoading(true);
    
    // Simulate API loading
    const timer = setTimeout(() => {
      const newPuzzle = generatePuzzle(category, difficulty);
      setPuzzle(newPuzzle);
      setUserAnswers(new Array(newPuzzle.grid.length).fill(''));
      setGameState('setup');
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [category, difficulty]);
  
  // Timer effect
  useEffect(() => {
    let interval;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Start game
  const startGame = () => {
    // Set timer based on difficulty
    let time;
    if (difficulty === 'easy') time = 60;
    else if (difficulty === 'medium') time = 45;
    else time = 30;
    
    setTimeRemaining(time);
    setTimerActive(true);
    setGameState('playing');
  };
  
  // Handle timeout
  const handleTimeout = () => {
    setTimerActive(false);
    setLives(prev => prev - 1);
    setGameState('failed');
    toast.error("Time's up! You lost a life.");
  };
  
  // Handle answer input
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };
  
  // Handle answer submission
  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    setTimerActive(false);
    
    const isCorrect = checkAnswers();
    
    if (isCorrect) {
      // Calculate score based on difficulty and time left
      let pointsEarned = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      pointsEarned += Math.floor(timeRemaining / 2); // Bonus for time left
      
      setScore(prev => prev + pointsEarned);
      setGameState('success');
      toast.success(`Correct! You earned ${pointsEarned} points.`);
    } else {
      setLives(prev => prev - 1);
      setGameState('failed');
      toast.error("Incorrect solution. You lost a life.");
    }
  };
  
  // Reset puzzle
  const resetPuzzle = () => {
    setLoading(true);
    
    // Generate new puzzle
    setTimeout(() => {
      const newPuzzle = generatePuzzle(category, difficulty);
      setPuzzle(newPuzzle);
      setUserAnswers(new Array(newPuzzle.grid.length).fill(''));
      setGameState('setup');
      setLoading(false);
    }, 800);
  };
  
  // Next puzzle after success
  const nextPuzzle = () => {
    resetPuzzle();
  };
  
  // Restart game after failure
  const restartGame = () => {
    if (lives <= 0) {
      setLives(3);
      setScore(0);
    }
    resetPuzzle();
  };
  
  // Check answers
  const checkAnswers = () => {
    if (!puzzle) return false;
    
    // Simple check for pattern category - all answers match solutions
    if (category === 'pattern') {
      return userAnswers.every((answer, index) => 
        answer.toString() === puzzle.solution[index].toString()
      );
    }
    
    // For word category
    if (category === 'word') {
      return userAnswers.join('').toLowerCase() === puzzle.solution.toLowerCase();
    }
    
    // For math category
    if (category === 'math') {
      return parseInt(userAnswers[0]) === puzzle.solution;
    }
    
    // For logic category
    if (category === 'logic') {
      return userAnswers[0] === puzzle.solution;
    }
    
    return false;
  };
  
  // Generate puzzle based on category and difficulty
  const generatePuzzle = (category, difficulty) => {
    // Pattern recognition puzzle
    if (category === 'pattern') {
      let gridSize = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
      let grid = [];
      let solution = [];
      
      // Generate a pattern (simple numerical sequence for this MVP)
      for (let i = 0; i < gridSize; i++) {
        const base = Math.floor(Math.random() * 5) + 1;
        grid.push(base);
        
        // Last element is the one to be guessed
        if (i === gridSize - 1) {
          solution.push(base);
        } else {
          solution.push('');
        }
      }
      
      return {
        type: 'pattern',
        instructions: 'Identify the pattern and fill in the missing value.',
        grid,
        solution,
      };
    }
    
    // Word puzzle
    if (category === 'word') {
      const words = {
        easy: ['APPLE', 'HOUSE', 'SMILE', 'BEACH', 'MUSIC'],
        medium: ['ELEPHANT', 'COMPUTER', 'SUNSHINE', 'MOUNTAIN', 'VACATION'],
        hard: ['XYLOPHONE', 'JUXTAPOSE', 'LABYRINTH', 'NIGHTFALL', 'QUADRUPLE']
      };
      
      // Select random word
      const wordList = words[difficulty];
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      
      // Scramble letters
      const scrambled = word.split('')
        .sort(() => Math.random() - 0.5)
        .join('');
      
      return {
        type: 'word',
        instructions: 'Unscramble the letters to form a word.',
        grid: scrambled.split(''),
        solution: word,
      };
    }
    
    // Math puzzle
    if (category === 'math') {
      let num1, num2, operation, result;
      
      // Generate math problem based on difficulty
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = '+';
        result = num1 + num2;
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        const ops = ['+', '-', '*'];
        operation = ops[Math.floor(Math.random() * ops.length)];
        
        if (operation === '+') result = num1 + num2;
        else if (operation === '-') result = num1 - num2;
        else result = num1 * num2;
      } else {
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * 30) + 10;
        const ops = ['+', '-', '*', '/'];
        operation = ops[Math.floor(Math.random() * ops.length)];
        
        if (operation === '+') result = num1 + num2;
        else if (operation === '-') result = num1 - num2;
        else if (operation === '*') result = num1 * num2;
        else {
          // Ensure clean division
          num2 = Math.floor(num1 / (Math.floor(Math.random() * 9) + 2));
          result = num1 / num2;
        }
      }
      
      return {
        type: 'math',
        instructions: 'Solve the math problem.',
        grid: [`${num1} ${operation} ${num2} = ?`],
        solution: result,
      };
    }
    
    // Logic puzzle
    if (category === 'logic') {
      const logicPuzzles = {
        easy: [
          { 
            question: 'If all roses are flowers, and some flowers fade quickly, then:', 
            options: [
              'All roses fade quickly',
              'Some roses may fade quickly',
              'No roses fade quickly',
              'Roses never fade'
            ],
            solution: 'Some roses may fade quickly'
          },
          {
            question: 'If it is raining, then the ground is wet. The ground is wet. Therefore:',
            options: [
              'It must be raining',
              'It might be raining, but there could be other reasons for the wet ground',
              'It is not raining',
              'The ground is always wet'
            ],
            solution: 'It might be raining, but there could be other reasons for the wet ground'
          }
        ],
        medium: [
          {
            question: 'All scientists are researchers. Some researchers are professors. Therefore:',
            options: [
              'All scientists are professors',
              'Some scientists might be professors',
              'No scientists are professors',
              'All professors are scientists'
            ],
            solution: 'Some scientists might be professors'
          }
        ],
        hard: [
          {
            question: 'If no heroes are cowards, and some soldiers are cowards, then:',
            options: [
              'All soldiers are heroes',
              'No soldiers are heroes',
              'Some soldiers are not heroes',
              'Some heroes are soldiers'
            ],
            solution: 'Some soldiers are not heroes'
          }
        ]
      };
      
      // Select random logic puzzle
      const puzzleList = logicPuzzles[difficulty];
      const puzzleIndex = Math.floor(Math.random() * puzzleList.length);
      const selectedPuzzle = puzzleList[puzzleIndex];
      
      return {
        type: 'logic',
        instructions: 'Analyze the statement and select the logical conclusion.',
        grid: [selectedPuzzle.question],
        options: selectedPuzzle.options,
        solution: selectedPuzzle.solution,
      };
    }
    
    // Default fallback
    return {
      type: 'pattern',
      instructions: 'Identify the pattern and fill in the missing value.',
      grid: [1, 2, 3],
      solution: [4],
    };
  };
  
  // Render patterns puzzle
  const renderPatternPuzzle = () => {
    if (!puzzle) return null;
    
    return (
      <div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {puzzle.grid.map((number, index) => (
            <div 
              key={index}
              className="aspect-square flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800 text-2xl font-bold shadow-neu-light dark:shadow-neu-dark"
            >
              {index === puzzle.grid.length - 1 ? (
                <input
                  type="text"
                  value={userAnswers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={gameState !== 'playing'}
                  className="w-full h-full text-center bg-transparent border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                  maxLength={2}
                />
              ) : (
                number
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render word puzzle
  const renderWordPuzzle = () => {
    if (!puzzle) return null;
    
    return (
      <div>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {puzzle.grid.map((letter, index) => (
            <div 
              key={index}
              className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800 text-2xl font-bold shadow-neu-light dark:shadow-neu-dark"
            >
              {letter}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            value={userAnswers[0] || ''}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            disabled={gameState !== 'playing'}
            placeholder="Type your answer"
            className="input text-center text-xl"
            maxLength={puzzle.solution.length}
          />
        </div>
      </div>
    );
  };
  
  // Render math puzzle
  const renderMathPuzzle = () => {
    if (!puzzle) return null;
    
    return (
      <div>
        <div className="text-center mb-6">
          <div className="text-3xl md:text-4xl font-bold mb-6">
            {puzzle.grid[0]}
          </div>
          
          <input
            type="number"
            value={userAnswers[0] || ''}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            disabled={gameState !== 'playing'}
            placeholder="Enter your answer"
            className="input text-center text-xl"
          />
        </div>
      </div>
    );
  };
  
  // Render logic puzzle
  const renderLogicPuzzle = () => {
    if (!puzzle) return null;
    
    return (
      <div>
        <div className="text-center mb-6">
          <div className="text-xl md:text-2xl font-medium mb-6">
            {puzzle.grid[0]}
          </div>
          
          <div className="space-y-3">
            {puzzle.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  userAnswers[0] === option 
                    ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                    : 'border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
                onClick={() => handleAnswerChange(0, option)}
                disabled={gameState !== 'playing'}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="card-neu overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2 first-letter:uppercase">
              {category} Puzzle
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4 md:mb-0">
              {puzzle?.instructions || 'Loading instructions...'}
            </p>
          </div>
          
          <div className="flex gap-3">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-primary text-white'
                    : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                }`}
                onClick={() => setDifficulty(level)}
                disabled={gameState === 'playing' || loading}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Game status bar */}
        <div className="flex justify-between items-center mb-6 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-primary" />
            <span className="font-medium">{score} pts</span>
          </div>
          
          <div className="flex items-center gap-2">
            {timeRemaining !== null ? (
              <>
                <TimerIcon className={`w-5 h-5 ${
                  timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-surface-600 dark:text-surface-400'
                }`} />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </>
            ) : (
              <span className="text-sm text-surface-500">Time will appear here</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <HeartIcon 
                key={i}
                className={`w-5 h-5 ${i < lives ? 'text-red-500' : 'text-surface-300 dark:text-surface-700'}`} 
              />
            ))}
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="mb-4"
            >
              <RefreshCwIcon className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="text-surface-600 dark:text-surface-400">
              Loading puzzle...
            </p>
          </div>
        )}
        
        {/* Game content */}
        {!loading && (
          <div>
            {/* Game board */}
            <div className="mb-8">
              {category === 'pattern' && renderPatternPuzzle()}
              {category === 'word' && renderWordPuzzle()}
              {category === 'math' && renderMathPuzzle()}
              {category === 'logic' && renderLogicPuzzle()}
            </div>
            
            {/* Game controls */}
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {gameState === 'setup' && (
                  <motion.div
                    key="setup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button 
                      className="btn btn-primary flex items-center gap-2"
                      onClick={startGame}
                    >
                      <BrainIcon className="w-5 h-5" />
                      Start Challenge
                    </button>
                  </motion.div>
                )}
                
                {gameState === 'playing' && (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button 
                      className="btn btn-primary flex items-center gap-2"
                      onClick={handleSubmit}
                    >
                      <CheckIcon className="w-5 h-5" />
                      Submit Answer
                    </button>
                  </motion.div>
                )}
                
                {gameState === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-green-500 mb-4 flex items-center justify-center gap-2">
                      <AwardIcon className="w-6 h-6" />
                      Correct Solution!
                    </div>
                    <button 
                      className="btn btn-primary flex items-center gap-2"
                      onClick={nextPuzzle}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                      Next Puzzle
                    </button>
                  </motion.div>
                )}
                
                {gameState === 'failed' && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-red-500 mb-4 flex items-center justify-center gap-2">
                      <XIcon className="w-6 h-6" />
                      {lives > 0 ? 'Incorrect Answer!' : 'Game Over!'}
                    </div>
                    <div className="mb-4 text-surface-600 dark:text-surface-400">
                      {lives > 0 ? (
                        `You have ${lives} ${lives === 1 ? 'life' : 'lives'} left.`
                      ) : (
                        'Your final score: ' + score
                      )}
                    </div>
                    <button 
                      className="btn btn-primary flex items-center gap-2"
                      onClick={restartGame}
                    >
                      <RefreshCwIcon className="w-5 h-5" />
                      {lives > 0 ? 'Try Again' : 'New Game'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Help tooltip */}
        <div className="mt-8 flex items-start gap-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg text-sm">
          <InfoIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-surface-700 dark:text-surface-300">
              {category === 'pattern' && "Look for the pattern in the sequence and determine what number should come next."}
              {category === 'word' && "Unscramble the letters to form a valid English word."}
              {category === 'math' && "Solve the mathematical equation and input your answer."}
              {category === 'logic' && "Apply logical reasoning to determine the correct conclusion based on the given premises."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
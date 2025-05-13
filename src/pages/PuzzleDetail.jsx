import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getPuzzleById } from '../services/puzzleService';
import { getPuzzleProgress, updatePuzzleProgress } from '../services/userProgressService';
import getIcon from '../utils/iconUtils';

const PuzzleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  
  const [puzzle, setPuzzle] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  const ClockIcon = getIcon('Clock');
  const FireIcon = getIcon('Flame');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const CheckCircleIcon = getIcon('CheckCircle');
  const XCircleIcon = getIcon('XCircle');

  // Load puzzle and progress data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get puzzle details
        const puzzleData = await getPuzzleById(id);
        setPuzzle(puzzleData);
        
        // Get user's progress for this puzzle if user is logged in
        if (user && user.userId) {
          const progressData = await getPuzzleProgress(user.userId, id);
          setProgress(progressData);
        }
        
        setLoading(false);
        // Start timer if not completed
        if (!progress?.completed) {
          setTimerActive(true);
        }
      } catch (error) {
        console.error("Error loading puzzle:", error);
        setLoading(false);
        toast.error("Failed to load puzzle");
      }
    };
    
    fetchData();
    
    // Cleanup timer on unmount
    return () => setTimerActive(false);
  }, [id, user]);
  
  // Timer logic
  useEffect(() => {
    let interval;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive]);
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Check user's answer
  const checkAnswer = async () => {
    setTimerActive(false);
    
    if (!puzzle || !user) return;
    
    const isCorrect = userAnswer.trim().toLowerCase() === puzzle.solution.trim().toLowerCase();
    const score = isCorrect ? calculateScore() : 0;
    
    // Update progress
    try {
      await updatePuzzleProgress(user.userId, puzzle.Id, {
        completed: isCorrect,
        score,
        time_taken: timeElapsed
      });
      
      // Update local state
      setProgress({
        ...progress,
        completed: isCorrect,
        score,
        time_taken: timeElapsed,
        attempts: progress ? progress.attempts + 1 : 1
      });
      
      toast.success(isCorrect ? "Correct! Well done!" : "Not quite right. Try again!");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to save your progress");
    }
  };
  
  // Calculate score based on time and difficulty
  const calculateScore = () => {
    const basePoints = puzzle.points || 100;
    const timeLimit = puzzle.time_limit || 300;
    const timeBonus = Math.max(0, 1 - (timeElapsed / timeLimit));
    
    // Apply difficulty multiplier
    let difficultyMultiplier = 1;
    switch (puzzle.difficulty) {
      case 'medium': difficultyMultiplier = 1.5; break;
      case 'hard': difficultyMultiplier = 2; break;
      case 'expert': difficultyMultiplier = 3; break;
    }
    
    return Math.round(basePoints * (1 + timeBonus) * difficultyMultiplier);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading puzzle...</div>;
  }
  
  if (!puzzle) {
    return <div className="text-center p-8">Puzzle not found</div>;
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
      >
        <ChevronLeftIcon className="w-5 h-5" /> Back to Dashboard
      </button>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{puzzle.title}</h1>
        <div className="flex items-center gap-4">
          <span className={`difficulty-${puzzle.difficulty}`}>{puzzle.difficulty}</span>
          <span className="flex items-center gap-1 text-sm">
            <ClockIcon className="w-4 h-4 text-primary" /> {formatTime(timeElapsed)}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <FireIcon className="w-4 h-4 text-orange-500" /> {puzzle.points} points
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-surface-700 dark:text-surface-300 mb-4">{puzzle.description}</p>
        <div className="bg-surface-50 dark:bg-surface-900 p-4 rounded-lg mb-6">
          <div dangerouslySetInnerHTML={{ __html: puzzle.content }} />
        </div>
      </div>
      
      {progress?.completed ? (
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-6 flex items-center gap-3">
          <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <div className="font-medium">Completed!</div>
            <div className="text-sm">Score: {progress.score} points • Time: {formatTime(progress.time_taken)}</div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="form-label" htmlFor="answer">Your Answer</label>
          <div className="flex gap-3">
            <input
              type="text"
              id="answer"
              className="form-input"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your solution here"
            />
            <button 
              className="btn btn-primary whitespace-nowrap"
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
      
      {/* Progress info if available */}
      {progress && !progress.completed && progress.attempts > 0 && (
        <div className="bg-surface-100 dark:bg-surface-700 p-4 rounded-lg flex items-center gap-3">
          <XCircleIcon className="w-6 h-6 text-red-500" />
          <div>
            <div className="font-medium">Not solved yet</div>
            <div className="text-sm">Attempts: {progress.attempts}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleDetail;
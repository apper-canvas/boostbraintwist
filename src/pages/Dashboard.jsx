import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import { fetchPuzzlesAsync } from '../store/puzzleSlice';
import { getUserProgress } from '../services/userProgressService';
import ProgressStats from '../components/ProgressStats';
import PuzzleGrid from '../components/PuzzleGrid';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { items: puzzles, status } = useSelector((state) => state.puzzles);
  const [userProgress, setUserProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const TrophyIcon = getIcon('Trophy');
  const CalendarIcon = getIcon('Calendar');
  const FireIcon = getIcon('Flame');
  const PuzzleIcon = getIcon('PuzzlePiece');
  
  // Fetch puzzles and user progress
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get all puzzles
        await dispatch(fetchPuzzlesAsync({ limit: 100 }));
        
        // Get user progress if user is logged in
        if (user && user.userId) {
          const progress = await getUserProgress(user.userId);
          setUserProgress(progress);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch, user]);
  
  // Calculate stats for user
  const stats = {
    total: puzzles.length,
    completed: userProgress.filter(p => p.completed).length,
    points: userProgress.reduce((sum, p) => sum + (p.score || 0), 0),
    streakDays: 0 // This would need more complex logic
  };
  
  // Get daily puzzle if available
  const dailyPuzzle = puzzles.find(p => p.is_daily_challenge);
  
  // Filtered puzzles based on active tab
  const filteredPuzzles = activeTab === 'all' 
    ? puzzles 
    : puzzles.filter(p => p.category === activeTab);

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.firstName || 'Puzzler'}!</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Continue your brain training journey with our puzzles and challenges.
        </p>
      </motion.div>
      
      {/* Stats overview */}
      <ProgressStats stats={stats} />
      
      {/* Daily challenge */}
      {dailyPuzzle && (
        <motion.div 
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Daily Challenge</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-video md:aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                <PuzzleIcon className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{dailyPuzzle.title}</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">
                {dailyPuzzle.description}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className={`difficulty-${dailyPuzzle.difficulty}`}>{dailyPuzzle.difficulty}</span>
                <span className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                  <FireIcon className="w-4 h-4 text-orange-500" /> {dailyPuzzle.points} points
                </span>
              </div>
              <Link to={`/puzzles/${dailyPuzzle.Id}`} className="btn btn-primary">
                Solve Now
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Puzzle categories and grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Browse Puzzles</h2>
        <PuzzleGrid puzzles={filteredPuzzles} userProgress={userProgress} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
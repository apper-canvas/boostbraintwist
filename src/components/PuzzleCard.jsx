import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const PuzzleCard = ({ puzzle, progress }) => {
  // Extract icons
  const FireIcon = getIcon('Flame');
  const ClockIcon = getIcon('Clock');
  const CheckCircleIcon = getIcon('CheckCircle');
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Determine if puzzle is completed
  const isCompleted = progress && progress.completed;
  
  return (
    <motion.div
      className={`card-neu hover:shadow-lg transition-all ${isCompleted ? 'border-l-4 border-green-500' : ''}`}
      variants={cardVariants}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`difficulty-${puzzle.difficulty}`}>
          {puzzle.difficulty}
        </span>
        {isCompleted && (
          <span className="text-green-500 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-1" /> Completed
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{puzzle.title}</h3>
      <p className="text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">
        {puzzle.description}
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="badge badge-neutral">{puzzle.category}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center text-sm text-surface-600 dark:text-surface-400">
            <FireIcon className="w-4 h-4 text-orange-500 mr-1" /> {puzzle.points}
          </span>
          <span className="flex items-center text-sm text-surface-600 dark:text-surface-400">
            <ClockIcon className="w-4 h-4 text-blue-500 mr-1" /> {puzzle.time_limit}m
          </span>
        </div>
      </div>
      
      <Link to={`/puzzles/${puzzle.Id}`} className="btn btn-primary block text-center">Solve Puzzle</Link>
    </motion.div>
  );
};

export default PuzzleCard;
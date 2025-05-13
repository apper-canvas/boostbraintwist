import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const PuzzlePieceIcon = getIcon('PuzzlePiece');
  const HomeIcon = getIcon('Home');
  const SearchIcon = getIcon('Search');
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        className="relative"
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ 
          rotate: [0, 10, 0, -10, 0],
          scale: [1, 1.05, 1, 1.05, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <PuzzlePieceIcon className="w-32 h-32 md:w-40 md:h-40 text-primary opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl md:text-8xl font-bold text-primary">?</span>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mt-8 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Page Not Found
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-md mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Oops! Looks like this puzzle piece doesn't fit here. The page you're looking for might have been moved or doesn't exist.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/" className="btn btn-primary flex items-center justify-center gap-2">
          <HomeIcon className="w-5 h-5" />
          Return Home
        </Link>
        
        <button className="btn btn-outline flex items-center justify-center gap-2">
          <SearchIcon className="w-5 h-5" />
          Search Puzzles
        </button>
      </motion.div>
      
      <motion.div 
        className="mt-16 p-6 rounded-xl bg-surface-100 dark:bg-surface-800 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-3">Looking for a challenge?</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-4">
          While you're here, why not try our featured puzzles or daily challenges to exercise your brain?
        </p>
        <Link to="/" className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium">
          Check out today's puzzles →
        </Link>
      </motion.div>
    </div>
  );
}
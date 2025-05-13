import { useState } from 'react';
import { motion } from 'framer-motion';
import PuzzleCard from './PuzzleCard';
import getIcon from '../utils/iconUtils';

const PuzzleGrid = ({ puzzles, userProgress, isLoading }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Get category icons
  const GridIcon = getIcon('Grid');
  const ScrollTextIcon = getIcon('ScrollText');
  const CalculatorIcon = getIcon('Calculator');
  const LightbulbIcon = getIcon('Lightbulb');
  
  // Category configuration
  const categories = [
    { id: 'all', name: 'All Puzzles', icon: getIcon('LayoutGrid') },
    { id: 'pattern', name: 'Pattern', icon: GridIcon },
    { id: 'word', name: 'Word', icon: ScrollTextIcon },
    { id: 'math', name: 'Math', icon: CalculatorIcon },
    { id: 'logic', name: 'Logic', icon: LightbulbIcon }
  ];
  
  // Filter puzzles by category
  const filteredPuzzles = filterCategory === 'all' 
    ? puzzles 
    : puzzles.filter(puzzle => puzzle.category === filterCategory);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setFilterCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              filterCategory === category.id 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            <category.icon className="w-5 h-5" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Puzzles grid */}
      {filteredPuzzles.length === 0 ? (
        <div className="text-center py-8 text-surface-600 dark:text-surface-400">
          No puzzles found in this category.
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPuzzles.map(puzzle => (
            <PuzzleCard 
              key={puzzle.Id} 
              puzzle={puzzle} 
              progress={userProgress?.find(p => p.puzzle_id === puzzle.Id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PuzzleGrid;
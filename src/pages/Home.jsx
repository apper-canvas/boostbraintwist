import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('pattern');
  
  const BrainIcon = getIcon('Brain');
  const PuzzleIcon = getIcon('PuzzlePiece');
  const ClockIcon = getIcon('Clock');
  const TrophyIcon = getIcon('Trophy');
  
  // Categories for puzzles
  const categories = [
    { id: 'pattern', name: 'Pattern', icon: getIcon('Grid') },
    { id: 'word', name: 'Word', icon: getIcon('ScrollText') },
    { id: 'math', name: 'Math', icon: getIcon('Calculator') },
    { id: 'logic', name: 'Logic', icon: getIcon('Lightbulb') }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="py-8 md:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="flex-1">
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Twist Your Brain with Puzzling Challenges
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-6 text-surface-700 dark:text-surface-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Exercise your mind with engaging puzzles designed to improve cognitive skills, 
              memory, and problem-solving abilities.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <button className="btn btn-primary">
                Start Playing
              </button>
              <button className="btn btn-outline">
                Learn More
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="aspect-square max-w-[400px] mx-auto rounded-2xl overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1610298324717-c7381aa29d6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Brain puzzle illustration" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">Daily Challenge</h3>
                <p className="text-sm">New puzzles every day to keep your mind sharp</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-6 -right-6 w-16 h-16 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <BrainIcon className="w-8 h-8" />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-white shadow-lg"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            >
              <PuzzleIcon className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Features */}
      <motion.section 
        className="py-10 md:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          variants={itemVariants}
        >
          Exercise Your Brain with Fun
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div 
            className="card-neu hover:translate-y-[-5px] transition-transform duration-300"
            variants={itemVariants}
          >
            <div className="mb-4 bg-primary/10 dark:bg-primary/20 w-14 h-14 rounded-lg flex items-center justify-center">
              <PuzzleIcon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Puzzle Types</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Choose from various puzzle types including pattern recognition, word puzzles, math challenges and logic problems.
            </p>
          </motion.div>
          
          <motion.div 
            className="card-neu hover:translate-y-[-5px] transition-transform duration-300"
            variants={itemVariants}
          >
            <div className="mb-4 bg-secondary/10 dark:bg-secondary/20 w-14 h-14 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Timed Challenges</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Test your speed with timed challenges and races against the clock to improve your mental reflexes.
            </p>
          </motion.div>
          
          <motion.div 
            className="card-neu hover:translate-y-[-5px] transition-transform duration-300 md:col-span-2 lg:col-span-1"
            variants={itemVariants}
          >
            <div className="mb-4 bg-accent/10 dark:bg-accent/20 w-14 h-14 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Achievement System</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Earn points, unlock achievements and track your progress as you become a puzzle master.
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Category selector */}
      <section className="py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Choose Your Challenge</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        {/* Main interactive puzzle feature */}
        <MainFeature category={selectedCategory} />
      </section>
    </div>
  );
}
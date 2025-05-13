import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const ProgressStats = ({ stats }) => {
  const CheckCircleIcon = getIcon('CheckCircle');
  const PuzzleIcon = getIcon('PuzzlePiece');
  const StarIcon = getIcon('Star');
  const FlameIcon = getIcon('Flame');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Stat items configuration
  const statItems = [
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircleIcon,
      color: 'text-green-500'
    },
    {
      label: 'Available',
      value: stats.total,
      icon: PuzzleIcon,
      color: 'text-blue-500'
    },
    {
      label: 'Points',
      value: stats.points,
      icon: StarIcon,
      color: 'text-yellow-500'
    },
    {
      label: 'Day Streak',
      value: stats.streakDays,
      icon: FlameIcon,
      color: 'text-orange-500'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statItems.map((item, index) => (
        <motion.div 
          key={item.label}
          className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card text-center"
          variants={itemVariants}
        >
          <div className={`flex justify-center mb-2 ${item.color}`}>
            <item.icon className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold mb-1">{item.value}</p>
          <p className="text-sm text-surface-600 dark:text-surface-400">{item.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProgressStats;
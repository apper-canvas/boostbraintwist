import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAchievements, getUserAchievements } from '../services/achievementService';
import getIcon from '../utils/iconUtils';

const Achievements = () => {
  const user = useSelector((state) => state.user.user);
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const AwardIcon = getIcon('Award');
  const LockIcon = getIcon('Lock');
  const UnlockIcon = getIcon('Unlock');

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true);
        
        // Get all achievements
        const allAchievements = await fetchAchievements();
        setAchievements(allAchievements);
        
        // Get user's achievements if logged in
        if (user && user.userId) {
          const unlockedAchievements = await getUserAchievements(user.userId);
          setUserAchievements(unlockedAchievements);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading achievements:", error);
        setLoading(false);
      }
    };
    
    loadAchievements();
  }, [user]);
  
  // Check if user has unlocked an achievement
  const isUnlocked = (achievementId) => {
    return userAchievements.some(a => a.Id === achievementId);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading achievements...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <AwardIcon className="w-6 h-6 text-primary" /> Achievements
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Track your progress and earn rewards as you solve puzzles.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.Id}
            className={`bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card ${
              isUnlocked(achievement.Id) ? 'border-2 border-primary/30' : 'opacity-70'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isUnlocked(achievement.Id) 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
                {isUnlocked(achievement.Id) 
                  ? <UnlockIcon className="w-6 h-6" />
                  : <LockIcon className="w-6 h-6" />
                }
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                  {achievement.description}
                </p>
                <div className="text-sm flex items-center gap-2">
                  <AwardIcon className="w-4 h-4 text-yellow-500" />
                  <span>{achievement.points} points</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
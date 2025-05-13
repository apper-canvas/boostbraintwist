import getApperClient from '../utils/apperClient';

const TABLE_NAME = 'achievement';

// Fetch all achievements
export const fetchAchievements = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "points" } },
        { Field: { Name: "icon" } },
        { Field: { Name: "unlock_condition" } }
      ],
      orderBy: [
        {
          field: "points",
          direction: "asc"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};

// Get user's unlocked achievements from user progress
export const getUserAchievements = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    // First get all user progress to calculate achievements
    const progressParams = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "user_id" } },
        { Field: { Name: "completed" } },
        { Field: { Name: "score" } },
        { Field: { Name: "puzzle_id" } }
      ],
      where: [
        {
          fieldName: "user_id",
          Operator: "ExactMatch",
          values: [userId]
        },
        {
          fieldName: "completed",
          Operator: "ExactMatch",
          values: [true]
        }
      ],
      expands: [
        {
          name: "puzzle_id",
          alias: "puzzle"
        }
      ]
    };
    
    const progressResponse = await apperClient.fetchRecords('user_progress', progressParams);
    const userProgress = progressResponse.data || [];
    
    // Now get all achievements to match with progress
    const achievements = await fetchAchievements();
    
    // Calculate which achievements are unlocked
    // This is a simplified example and would need more complex logic in a real app
    const unlockedAchievements = achievements.filter(achievement => {
      // Simple achievement conditions based on number of completed puzzles
      if (achievement.unlock_condition.includes('complete_puzzles')) {
        const requiredCount = parseInt(achievement.unlock_condition.split(':')[1]);
        return userProgress.length >= requiredCount;
      }
      
      // Achievement for completing puzzles of a specific category
      if (achievement.unlock_condition.includes('category_complete')) {
        const category = achievement.unlock_condition.split(':')[1];
        const categoryPuzzles = userProgress.filter(
          progress => progress.puzzle?.category === category
        );
        return categoryPuzzles.length > 0;
      }
      
      return false;
    });
    
    return unlockedAchievements;
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
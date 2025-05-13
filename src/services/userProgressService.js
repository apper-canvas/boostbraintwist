import getApperClient from '../utils/apperClient';

const TABLE_NAME = 'user_progress';

// Get progress for a specific user
export const getUserProgress = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "user_id" } },
        { Field: { Name: "completed" } },
        { Field: { Name: "score" } },
        { Field: { Name: "time_taken" } },
        { Field: { Name: "attempts" } },
        { Field: { Name: "completed_date" } },
        { Field: { Name: "puzzle_id" } }
      ],
      where: [
        {
          fieldName: "user_id",
          Operator: "ExactMatch",
          values: [userId]
        }
      ],
      expands: [
        {
          name: "puzzle_id",
          alias: "puzzle"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
};

// Get progress for a specific puzzle and user
export const getPuzzleProgress = async (userId, puzzleId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "user_id" } },
        { Field: { Name: "completed" } },
        { Field: { Name: "score" } },
        { Field: { Name: "time_taken" } },
        { Field: { Name: "attempts" } },
        { Field: { Name: "completed_date" } },
        { Field: { Name: "puzzle_id" } }
      ],
      where: [
        {
          fieldName: "user_id",
          Operator: "ExactMatch",
          values: [userId]
        },
        {
          fieldName: "puzzle_id",
          Operator: "ExactMatch",
          values: [puzzleId]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data || response.data.length === 0) {
      return null;
    }
    
    return response.data[0];
  } catch (error) {
    console.error("Error fetching puzzle progress:", error);
    throw error;
  }
};

// Create or update progress for a puzzle
export const updatePuzzleProgress = async (userId, puzzleId, progressData) => {
  try {
    const apperClient = getApperClient();
    
    // Check if progress record exists
    const existingProgress = await getPuzzleProgress(userId, puzzleId);
    
    if (existingProgress) {
      // Update existing record
      const params = {
        records: [{
          Id: existingProgress.Id,
          user_id: userId,
          puzzle_id: puzzleId,
          completed: progressData.completed,
          score: progressData.score,
          time_taken: progressData.time_taken,
          attempts: existingProgress.attempts + 1,
          completed_date: progressData.completed ? new Date().toISOString() : null
        }]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        throw new Error("Failed to update progress");
      }
      
      return response.results[0].data;
    } else {
      // Create new record
      const params = {
        records: [{
          Name: `Progress for ${userId} on puzzle ${puzzleId}`,
          user_id: userId,
          puzzle_id: puzzleId,
          completed: progressData.completed || false,
          score: progressData.score || 0,
          time_taken: progressData.time_taken || 0,
          attempts: 1,
          completed_date: progressData.completed ? new Date().toISOString() : null
        }]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        throw new Error("Failed to create progress");
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating puzzle progress:", error);
    throw error;
  }
};
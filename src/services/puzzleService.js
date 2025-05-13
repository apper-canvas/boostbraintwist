import getApperClient from '../utils/apperClient';

const TABLE_NAME = 'puzzle';

// Fetch all puzzles with optional filtering
export const fetchPuzzles = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Basic query parameters
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "category" } },
        { Field: { Name: "difficulty" } },
        { Field: { Name: "time_limit" } },
        { Field: { Name: "points" } },
        { Field: { Name: "is_daily_challenge" } }
      ],
      pagingInfo: {
        limit: filters.limit || 20,
        offset: filters.offset || 0
      }
    };
    
    // Add filters if provided
    if (filters.category && filters.category !== 'all') {
      params.where = [
        {
          fieldName: "category",
          Operator: "ExactMatch",
          values: [filters.category]
        }
      ];
    }
    
    // Add sorting
    if (filters.sortBy) {
      params.orderBy = [
        {
          field: filters.sortBy,
          direction: filters.sortDirection || "asc"
        }
      ];
    }
    
    // If dailyChallenge flag is set, filter for daily challenges only
    if (filters.dailyChallenge) {
      params.where = [
        ...(params.where || []),
        {
          fieldName: "is_daily_challenge",
          Operator: "ExactMatch",
          values: [true]
        }
      ];
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    throw error;
  }
};

// Get a single puzzle by ID with full details
export const getPuzzleById = async (puzzleId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "category" } },
        { Field: { Name: "difficulty" } },
        { Field: { Name: "time_limit" } },
        { Field: { Name: "points" } },
        { Field: { Name: "content" } },
        { Field: { Name: "solution" } },
        { Field: { Name: "is_daily_challenge" } }
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, puzzleId, params);
    
    if (!response || !response.data) {
      throw new Error("Puzzle not found");
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching puzzle with ID ${puzzleId}:`, error);
    throw error;
  }
};

// Create a new puzzle
export const createPuzzle = async (puzzleData) => {
  try {
    const apperClient = getApperClient();
    
    // Format data for creation
    const params = {
      records: [{
        Name: puzzleData.title || "New Puzzle",
        title: puzzleData.title,
        description: puzzleData.description,
        category: puzzleData.category,
        difficulty: puzzleData.difficulty,
        time_limit: puzzleData.time_limit,
        points: puzzleData.points,
        content: puzzleData.content,
        solution: puzzleData.solution,
        is_daily_challenge: puzzleData.is_daily_challenge || false
      }]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error("Failed to create puzzle");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating puzzle:", error);
    throw error;
  }
};

// Update an existing puzzle
export const updatePuzzle = async (puzzleId, puzzleData) => {
  try {
    const apperClient = getApperClient();
    
    // Format data for update
    const params = {
      records: [{
        Id: puzzleId,
        Name: puzzleData.title || "Updated Puzzle",
        title: puzzleData.title,
        description: puzzleData.description,
        category: puzzleData.category,
        difficulty: puzzleData.difficulty,
        time_limit: puzzleData.time_limit,
        points: puzzleData.points,
        content: puzzleData.content,
        solution: puzzleData.solution,
        is_daily_challenge: puzzleData.is_daily_challenge
      }]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error("Failed to update puzzle");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating puzzle:", error);
    throw error;
  }
};

// Delete a puzzle
export const deletePuzzle = async (puzzleId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [puzzleId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error("Failed to delete puzzle");
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    throw error;
  }
};
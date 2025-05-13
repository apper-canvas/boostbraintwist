import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAchievements, getUserAchievements } from '../services/achievementService';

// Async thunks for API calls
export const fetchAchievementsAsync = createAsyncThunk(
  'achievements/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAchievements();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserAchievementsAsync = createAsyncThunk(
  'achievements/getUserAchievements',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserAchievements(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const achievementSlice = createSlice({
  name: 'achievements',
  initialState: {
    items: [],
    userAchievements: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievementsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getUserAchievementsAsync.fulfilled, (state, action) => {
        state.userAchievements = action.payload;
        state.status = 'succeeded';
      });
  }
});

export default achievementSlice.reducer;
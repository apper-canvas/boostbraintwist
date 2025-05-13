import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPuzzles, getPuzzleById, createPuzzle, updatePuzzle, deletePuzzle } from '../services/puzzleService';

// Async thunks for API calls
export const fetchPuzzlesAsync = createAsyncThunk(
  'puzzles/fetchPuzzles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchPuzzles(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPuzzleByIdAsync = createAsyncThunk(
  'puzzles/getPuzzleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPuzzleById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPuzzleAsync = createAsyncThunk(
  'puzzles/createPuzzle',
  async (puzzleData, { rejectWithValue }) => {
    try {
      const response = await createPuzzle(puzzleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePuzzleAsync = createAsyncThunk(
  'puzzles/updatePuzzle',
  async ({ id, puzzleData }, { rejectWithValue }) => {
    try {
      const response = await updatePuzzle(id, puzzleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePuzzleAsync = createAsyncThunk(
  'puzzles/deletePuzzle',
  async (id, { rejectWithValue }) => {
    try {
      await deletePuzzle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const puzzleSlice = createSlice({
  name: 'puzzles',
  initialState: {
    items: [],
    currentPuzzle: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filteredCategory: 'all'
  },
  reducers: {
    setFilteredCategory: (state, action) => {
      state.filteredCategory = action.payload;
    },
    clearCurrentPuzzle: (state) => {
      state.currentPuzzle = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPuzzlesAsync
      .addCase(fetchPuzzlesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPuzzlesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPuzzlesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle getPuzzleByIdAsync
      .addCase(getPuzzleByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPuzzleByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPuzzle = action.payload;
      })
      .addCase(getPuzzleByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setFilteredCategory, clearCurrentPuzzle } = puzzleSlice.actions;
export default puzzleSlice.reducer;
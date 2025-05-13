import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import puzzleReducer from './puzzleSlice';
import achievementReducer from './achievementSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    puzzles: puzzleReducer,
    achievements: achievementReducer
  }
});
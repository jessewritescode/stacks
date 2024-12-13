import { configureStore } from '@reduxjs/toolkit';
import mediaStatusSlice from './features/media-status-slice';

export const store = configureStore({
  reducer: {
    mediaStatus: mediaStatusSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

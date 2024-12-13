import { configureStore } from '@reduxjs/toolkit';
import mediaStatusSlice from './features/media-status-slice';
import mediaQueueSlice from './features/media-queue-slice';

export const store = configureStore({
  reducer: {
    mediaStatus: mediaStatusSlice,
    mediaQueue: mediaQueueSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

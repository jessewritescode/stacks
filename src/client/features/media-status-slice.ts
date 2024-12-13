import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ITrackStatus } from '@shared/track-status';
import { IMediaStatus as IMediaStatusDTO } from '@shared/media-status';

interface IMediaStatusState {
  queuePosition: number;
  position: number;
  duration: number;
  state: 'playing' | 'paused' | 'stopped' | 'loading';
  loading: boolean;
  error: string | null;
}

const initialState: IMediaStatusState = {
  queuePosition: 0,
  position: 0,
  duration: 0,
  state: 'stopped',
  loading: false,
  error: null,
};

export const fetchMediaStatus = createAsyncThunk<IMediaStatusDTO, void, { rejectValue: string }>(
  'mediaStatus/fetchMediaStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/status'); // Replace with actual API
      if (!response.ok) {
        throw new Error('Failed to fetch media status');
      }
      return (await response.json()) as IMediaStatusDTO;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const prev = createAsyncThunk<void, void, { rejectValue: string }>(
  'mediaStatus/prev',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/prev');
      if (!response.ok) {
        throw new Error('Failed to fetch prev');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const next = createAsyncThunk<void, void, { rejectValue: string }>(
  'mediaStatus/next',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/next');
      if (!response.ok) {
        throw new Error('Failed to fetch next');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const mediaStatusSlice = createSlice({
  name: 'mediaStatus',
  initialState,
  reducers: {
    resetMediaStatus: (state) => {
      state.queuePosition = initialState.queuePosition;
      state.position = initialState.position;
      state.duration = initialState.duration;
      state.state = 'stopped';
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.state = action.payload.state;
        state.position = action.payload.currentTrack.position;
        state.duration = action.payload.currentTrack.duration;
        state.queuePosition = action.payload.currentTrack.queuePosition - 1; // sonos queue is 1-based
      })
      .addCase(fetchMediaStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(prev.pending, (state) => {
        state.queuePosition = state.queuePosition - 1;
        state.error = null;
      })
      .addCase(prev.rejected, (state, action) => {
        state.queuePosition = state.queuePosition + 1;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(next.pending, (state) => {
        state.queuePosition = state.queuePosition + 1;
        state.error = null;
      })
      .addCase(next.rejected, (state, action) => {
        state.queuePosition = state.queuePosition - 1;
        state.error = action.payload || 'An error occurred';
      });
  },
});

// Actions
export const { resetMediaStatus } = mediaStatusSlice.actions;

// Selectors
export const selectMediaStatus = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus;
export const selectQueuePosition = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.queuePosition;
export const selectDuration = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.duration;
export const selectPosition = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.position;
export const selectMediaStatusState = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.state;
export const selectMediaStatusLoading = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.loading;
export const selectMediaStatusError = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.error;

export default mediaStatusSlice.reducer;

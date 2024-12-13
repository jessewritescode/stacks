import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IQueue } from '@shared/queue';

interface IQueueDTO {
  queue: IQueue | null;
}

export const fetchMediaQueue = createAsyncThunk<IQueue, void, { rejectValue: string }>(
  'mediaQueue/fetchMediaQueue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/queue');
      if (!response.ok) {
        throw new Error('Failed to fetch media queue');
      }
      const data: IQueueDTO = await response.json();
      if (data.queue === null) {
        throw new Error('Queue is null');
      }
      return data.queue;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

interface IMediaQueueState {
  queue: IQueue | null;
  loading: boolean;
  error: string | null;
}

const initialState: IMediaQueueState = {
  queue: null,
  loading: false,
  error: null,
};

const mediaQueueSlice = createSlice({
  name: 'mediaQueue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaQueue.fulfilled, (state, action: PayloadAction<IQueue>) => {
        state.loading = false;
        state.queue = action.payload;
      })
      .addCase(fetchMediaQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectMediaQueue = (state: { mediaQueue: IMediaQueueState }) => state.mediaQueue.queue;
export const selectMediaQueueItems = (state: { mediaQueue: IMediaQueueState }) => state.mediaQueue.queue?.items || [];

export default mediaQueueSlice.reducer;

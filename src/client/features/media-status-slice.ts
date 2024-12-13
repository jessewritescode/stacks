import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IMediaStatus as IMediaStatusDTO } from '@shared/media-status';
import { ITrackStatus } from '@shared/track-status';

// Initial state matching MediaStatusDTO with an additional loading and error state
interface IMediaStatusState extends IMediaStatusDTO {}

// Initial state
const initialState: IMediaStatusState = {
  currentTrack: {
    id: null,
    parentID: null,
    title: '',
    artist: '',
    album: '',
    albumArtist: null,
    albumArtURI: null,
    position: 0,
    duration: 0,
    albumArtURL: null,
    uri: '',
    queuePosition: 0,
  },
  state: 'stopped',
  loading: false,
  error: null,
};

// Async thunk to fetch the media status
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

// Slice definition
const mediaStatusSlice = createSlice({
  name: 'mediaStatus',
  initialState,
  reducers: {
    resetMediaStatus: (state) => {
      state.currentTrack = initialState.currentTrack;
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
        state.currentTrack = action.payload.currentTrack;
        state.state = action.payload.state;
      })
      .addCase(fetchMediaStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

// Actions
export const { resetMediaStatus } = mediaStatusSlice.actions;

// Selectors
export const selectMediaStatus = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus;
export const selectCurrentTrack = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.currentTrack;
export const selectMediaStatusState = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.state;
export const selectMediaStatusLoading = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.loading;
export const selectMediaStatusError = (state: { mediaStatus: IMediaStatusState }) => state.mediaStatus.error;

export default mediaStatusSlice.reducer;

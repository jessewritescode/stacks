import { ITrackStatus } from './track-status';

export interface IMediaStatus {
  currentTrack: ITrackStatus;
  state: 'playing' | 'paused' | 'stopped' | 'loading';
  loading: boolean;
  error: string | null;
}

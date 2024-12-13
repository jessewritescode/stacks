export interface ITrackStatus {
  id: string | null;
  parentID: string | null;
  title: string;
  artist: string;
  album: string;
  albumArtist: string | null;
  albumArtURI: string | null;
  position: number; // Seconds elapsed in the track
  duration: number; // Total duration in seconds
  albumArtURL: string | null;
  uri: string;
  queuePosition: number; // Position in the queue
}

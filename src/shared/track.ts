export interface ITrack {
  id: string;
  parentID: string;
  title: string;
  artist: string;
  album: string;
  albumArtist: string | null;
  albumArtURL: string;
  uri: string;
}

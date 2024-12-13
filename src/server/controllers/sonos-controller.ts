// @ts-ignore
import { Sonos } from 'sonos';
import { IMediaStatus } from '@shared/media-status';
import * as config from '../config';
import { ITrackStatus } from '@shared/track-status';

const transformCurrentTrack = (currentTrack: ITrackStatus) => {
  try {
    const url = new URL(currentTrack.albumArtURL || '');
    const albumArtUrl = `${url.pathname}${url.search}`;

    return {
      ...currentTrack,
      albumArtURL: albumArtUrl,
    };
  } catch (error) {
    console.log('Error transforming current track:', error);
    throw new Error('Invalid URL');
  }
};

const getCurrentStatus = async (): Promise<IMediaStatus> => {
  const device = new Sonos(config.SONOS_HOST);
  const _currentTrack = await device.currentTrack();
  const currentTrack = transformCurrentTrack(_currentTrack);
  const state = await device.getCurrentState();
  return { currentTrack, state, loading: false, error: null };
};

export { getCurrentStatus };
module.exports = { getCurrentStatus };

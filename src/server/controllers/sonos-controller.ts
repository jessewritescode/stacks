// @ts-ignore
import { Sonos } from 'sonos';
import { IMediaStatus } from '@shared/media-status';

const sonosHost = process.env.SONOS_HOST || '';

const getCurrentStatus = async (): Promise<IMediaStatus> => {
  const device = new Sonos(sonosHost);
  const currentTrack = await device.currentTrack();
  const state = await device.getCurrentState();
  return { currentTrack, state, loading: false, error: null };
};

export { getCurrentStatus };
module.exports = { getCurrentStatus };

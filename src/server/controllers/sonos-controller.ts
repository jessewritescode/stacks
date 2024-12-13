// @ts-ignore
import { Sonos } from 'sonos';
import { IMediaStatus } from '@shared/media-status';
import { ITrackStatus } from '@shared/track-status';
import { IQueue } from '@shared/queue';
import { ITrack } from '@shared/track';
import * as config from '../config';

const transformAlbumArtUrl = (address: string) => {
  try {
    const url = new URL(address || '');
    const albumArtUrl = `${url.pathname}${url.search}`;

    return albumArtUrl;
  } catch (error) {
    console.log('Error transforming current track:', error);
    throw new Error('Invalid URL');
  }
};

const getCurrentStatus = async (): Promise<IMediaStatus> => {
  const device = new Sonos(config.SONOS_HOST);
  const _currentTrack = await device.currentTrack();
  const currentTrack = {
    ..._currentTrack,
    albumArtURL: transformAlbumArtUrl(_currentTrack.albumArtURL),
  };
  const state = await device.getCurrentState();
  return { currentTrack, state, loading: false, error: null };
};

const getQueue = async (): Promise<any> => {
  const device = new Sonos(config.SONOS_HOST);
  const _queue = await device.getQueue();

  const queue: IQueue = {
    ..._queue,
    items: _queue.items.map((item: any) => {
      const _track: ITrack = {
        id: item.id,
        parentID: item.parentID,
        title: item.title,
        artist: item.artist,
        album: item.album,
        albumArtist: item.albumArtist,
        albumArtURL: transformAlbumArtUrl(item.albumArtURI),
        uri: item.uri,
      };

      return _track;
    }),
  };

  return { queue };
};

const prev = async (): Promise<any> => {
  const device = new Sonos(config.SONOS_HOST);
  const response = await device.previous();
  return response;
};

const next = async (): Promise<any> => {
  const device = new Sonos(config.SONOS_HOST);
  const response = await device.next();
  return response;
};

export { getCurrentStatus, getQueue, next, prev };
module.exports = { getCurrentStatus, getQueue, next, prev };

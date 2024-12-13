import { ITrack } from './track';

export interface IQueue {
  returned: string;
  total: string;
  updateID: string;
  items: ITrack[];
}

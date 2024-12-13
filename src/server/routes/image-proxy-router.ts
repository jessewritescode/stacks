import { Router, Request, Response } from 'express';
import * as config from '../config';
import axios from 'axios';

export function imageProxyRouter(): Router {
  const router = Router();

  router.get('/getaa', async (req: Request, res: Response) => {
    const { s, u } = req.query;

    if (!s || !u) {
      return res.status(400).json({ error: 'Missing required query parameters: s and u' });
    }

    try {
      const decodedU = decodeURIComponent(u as string);

      const sonosUrl = `http://${config.SONOS_HOST}:1400/getaa?s=${s}&u=${encodeURIComponent(decodedU)}`;

      const response = await axios({
        method: 'get',
        url: sonosUrl,
        responseType: 'stream',
      });

      res.set('Content-Type', response.headers['content-type']);
      res.set('Content-Length', response.headers['content-length']);

      response.data.pipe(res);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch resource.';
      console.error(`Error handling /getaa:`, errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  return router;
}

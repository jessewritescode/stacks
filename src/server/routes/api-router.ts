import bodyParser from 'body-parser';
import { Router } from 'express';
import { getCurrentStatus, getQueue, next, prev } from '../controllers/sonos-controller';

export function apiRouter(): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/status', async (req, res) => {
    try {
      const data = await getCurrentStatus();
      res.json(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  router.get('/queue', async (req, res) => {
    try {
      const data = await getQueue();
      res.json(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  router.get('/prev', async (req, res) => {
    try {
      const data = await prev();
      res.json(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  router.get('/next', async (req, res) => {
    try {
      const data = await next();
      res.json(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  return router;
}

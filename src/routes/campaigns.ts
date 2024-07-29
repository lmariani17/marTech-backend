import { Router, Request, Response } from 'express';

const router = Router();

router.post('/campaigns', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

router.get('/campaigns', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

router.get('/campaigns/:id', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

router.put('/campaigns/:id', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

router.delete('/campaigns/:id', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

export default router;

import { Router } from 'express';
import { exportCards } from '../controllers/gameController.js';

export const cardsRouter = Router();

cardsRouter.get('/export', exportCards);

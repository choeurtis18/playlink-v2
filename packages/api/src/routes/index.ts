import { Router } from 'express';
import { gamesRouter } from './games.js';
import { cardsRouter } from './cards.js';
import { adminRouter } from './admin/index.js';

export const router = Router();

router.use('/games', gamesRouter);
router.use('/cards', cardsRouter);
router.use('/admin', adminRouter);

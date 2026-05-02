import { Router } from 'express';
import { listGames, getGame } from '../controllers/gameController.js';

export const gamesRouter = Router();

gamesRouter.get('/', listGames);
gamesRouter.get('/:gameId', getGame);

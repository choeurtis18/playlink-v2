import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import {
  adminListGames, adminCreateGame, adminUpdateGame, adminDeleteGame,
  adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminListCards, adminCreateCard, adminUpdateCard, adminDeleteCard,
  adminBulkImport, adminStats,
} from '../../controllers/adminController.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);

// Stats
adminRouter.get('/stats', adminStats);

// Games
adminRouter.get('/games', adminListGames);
adminRouter.post('/games', adminCreateGame);
adminRouter.put('/games/:id', adminUpdateGame);
adminRouter.delete('/games/:id', adminDeleteGame);

// Categories
adminRouter.get('/categories', adminListCategories);
adminRouter.post('/categories', adminCreateCategory);
adminRouter.put('/categories/:id', adminUpdateCategory);
adminRouter.delete('/categories/:id', adminDeleteCategory);

// Cards
adminRouter.get('/cards', adminListCards);
adminRouter.post('/cards', adminCreateCard);
adminRouter.put('/cards/:id', adminUpdateCard);
adminRouter.delete('/cards/:id', adminDeleteCard);

// Bulk import
adminRouter.post('/bulk-import', adminBulkImport);

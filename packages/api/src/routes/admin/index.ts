import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import {
  adminListGames, adminGetGame, adminCreateGame, adminUpdateGame, adminDeleteGame,
  adminExportGames, adminImportGames,
  adminListCategories, adminGetCategory, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminExportCategories, adminImportCategories,
  adminListCards, adminGetCard, adminCreateCard, adminUpdateCard, adminDeleteCard,
  adminExportCards, adminImportCards,
  adminBulkImport, adminStats,
} from '../../controllers/adminController.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);

// Stats
adminRouter.get('/stats', adminStats);

// Games
adminRouter.get('/games/export', adminExportGames);
adminRouter.post('/games/import', adminImportGames);
adminRouter.get('/games', adminListGames);
adminRouter.get('/games/:id', adminGetGame);
adminRouter.post('/games', adminCreateGame);
adminRouter.put('/games/:id', adminUpdateGame);
adminRouter.delete('/games/:id', adminDeleteGame);

// Categories
adminRouter.get('/categories/export', adminExportCategories);
adminRouter.post('/categories/import', adminImportCategories);
adminRouter.get('/categories', adminListCategories);
adminRouter.get('/categories/:id', adminGetCategory);
adminRouter.post('/categories', adminCreateCategory);
adminRouter.put('/categories/:id', adminUpdateCategory);
adminRouter.delete('/categories/:id', adminDeleteCategory);

// Cards
adminRouter.get('/cards/export', adminExportCards);
adminRouter.post('/cards/import', adminImportCards);
adminRouter.get('/cards', adminListCards);
adminRouter.get('/cards/:id', adminGetCard);
adminRouter.post('/cards', adminCreateCard);
adminRouter.put('/cards/:id', adminUpdateCard);
adminRouter.delete('/cards/:id', adminDeleteCard);

// Bulk import (legacy text mode)
adminRouter.post('/bulk-import', adminBulkImport);

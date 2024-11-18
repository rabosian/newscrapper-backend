import express from 'express';
import { authenticate } from '../controllers/authController.js';
import {
  addFavoriteArticle,
  deleteFavoriteArticle,
  getFavoriteArticle,
} from '../controllers/favoriteController.js';
const router = express.Router();

router.get('/', authenticate, getFavoriteArticle);
router.post('/', authenticate, addFavoriteArticle);
router.delete('/:id', authenticate, deleteFavoriteArticle);

export default router;

import express from 'express';
const router = express.Router();
import {
  createComment,
  deleteComment,
  getCommentsByArticle,
  updateComment,
} from '../controllers/commentController.js';
import { authenticate } from '../controllers/authController.js';

router.post('/', authenticate, createComment);
router.get('/', getCommentsByArticle);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;

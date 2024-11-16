import express from 'express';
const router = express.Router();
import { createComment, deleteComment, getCommentsByArticle } from '../controllers/commentController.js';

router.post('/', createComment);
router.get('/', getCommentsByArticle);
router.delete('/:id', deleteComment);

export default router;

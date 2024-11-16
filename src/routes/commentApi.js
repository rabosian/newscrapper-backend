import express from 'express';
import { createComment, deleteComment, getCommentsByArticle } from '../controllers/commentController';
const router = express.Router();

router.post('/', createComment);
router.get('/', getCommentsByArticle);
router.delete('/:id', deleteComment);

export default router;

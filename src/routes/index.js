import express from 'express';
import userApi from './userApi.js';
import authApi from './authApi.js';
import articlesApi from './articleApi.js';
import favoriteApi from './favoriteApi.js';
import commentApi from './commentApi.js';
import aiApi from './aiApi.js';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/articles', articlesApi);
router.use('/favorites', favoriteApi);
router.use('/comments', commentApi);
router.use('/ai', aiApi);

export default router;

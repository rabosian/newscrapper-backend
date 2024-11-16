import express from 'express';
import userApi from './userApi.js';
import authApi from './authApi.js';
import articlesApi from './articleApi.js';
import commentApi from './commentApi.js';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/articles', articlesApi)
router.use('/comments', commentApi)

export default router;

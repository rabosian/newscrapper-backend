import express from 'express';
import userApi from './userApi.js';
import authApi from './authApi.js';
import articlesApi from './articleApi.js';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/articles', articlesApi)

export default router;

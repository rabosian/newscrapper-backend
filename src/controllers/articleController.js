import Article from '../models/Article.js';

const PAGE_SIZE = 30;
const articleController = {};

articleController.getArticles = async (req, res) => {
  try {
    // 페이지네이션
    const { page } = req.query;
    let query = Article.find();
    let response = { status: 'success' };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalArticleNum = await Article.find().countDocuments();
      const totalPageNum = Math.ceil(totalArticleNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const articleList = await query.exec();
    response.articles = articleList;
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: 'Failed', error: err.message });
  }
};

export default articleController;

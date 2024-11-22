import Article from '../models/Article.js';

const PAGE_SIZE = 30;
const articleController = {};

articleController.getArticles = async (req, res) => {
  try {
    const { page, category } = req.query;
    const condition = category ? { category } : {};
    let query = Article.find(condition).sort({ publishedAt: -1 });
    let response = { status: 'success' };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalArticleNum = await Article.find(condition).countDocuments();
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

articleController.updateArticleView = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    article.views += 1;

    await article.save();
    res.status(200).json({ status: 'success', article });
  } catch (err) {
    res.status(400).json({ status: 'Failed', error: err.message });
  }
};

export default articleController;

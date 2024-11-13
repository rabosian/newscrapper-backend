import { newsAPI_Everything } from '../services/newsApiService.js';

const articleController = {};

// newsAPI_Everything
articleController.getArticles = async (req, res) => {
  try {
    const articles = await newsAPI_Everything();
    res.status(200).json({ status: 'Success', articles });
  } catch (err) {
    res.status(500).json({ status: 'Failed', error: err.message });
  }
};

export default articleController;

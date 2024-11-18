import FavoriteArticle from '../models/FavoriteArticle.js';

export const addFavoriteArticle = async (req, res) => {
  try {
    const { userId } = req;
    const { articleId } = req.body;

    let favorites = await FavoriteArticle.findOne({ userId });
    // favorites not exist > create new favorite
    if (!favorites) {
      favorites = new FavoriteArticle({ userId, articleList: [articleId] });
      await favorites.save();
      res.status(200).json({ status: 'success', favorites });
    }

    // article already exists > return error
    if (favorites.articleList.includes(articleId))
      throw new Error('Article already added to favorites');

    // favorites exists > add article into articleList
    favorites.articleList.push(articleId);
    await favorites.save();
    res.status(200).json({ status: 'success', favorites });
  } catch (err) {
    res.status(400).json({ status: 'Failed', error: err.message });
  }
};

export const getFavoriteArticle = async (req, res) => {
  try {
    const { userId } = req;
    const favorites = await FavoriteArticle.findOne({ userId }).populate({
      path: 'articleList.articleId',
      model: 'Article',
    });

    if (!favorites) throw new Error('Favorites not found');

    res.status(200).json({ status: 'success', favorites });
  } catch (err) {
    res.status(400).json({ status: 'Failed', error: err.message });
  }
};

export const deleteFavoriteArticle = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const favorites = await FavoriteArticle.findOne({ userId });
    if (!favorites) throw new Error('Favorites not found');

    const articleIndex = favorites.articleList.findIndex((item) =>
      item.articleId.equals(id)
    );
    if (articleIndex === -1) throw new Error('Article not found in favorites');

    favorites.articleList.splice(articleIndex, 1);
    await favorites.save();
    res.status(200).json({ status: 'success', favorites });
  } catch (err) {
    res.status(400).json({ status: 'Failed', error: err.message });
  }
};

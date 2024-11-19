import mongoose from 'mongoose';
import User from './User.js';
import Article from './Article.js';

const favoriteArticleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User },
    articleList: [
      {
        articleId: { type: mongoose.ObjectId, ref: Article, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

favoriteArticleSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const FavoriteArticle = mongoose.model(
  'FavoriteArticle',
  favoriteArticleSchema
);
export default FavoriteArticle;

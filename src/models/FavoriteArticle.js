import mongoose from 'mongoose';
import User from './User.js';
import Article from './Article.js';

const favoriteArticleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.ObjectId, ref: User },
    article: { type: mongoose.ObjectId, ref: Article },
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

const favoriteArticle = mongoose.model(
  'FavoriteArticle',
  favoriteArticleSchema
);
export default FavoriteArticle;

import mongoose from 'mongoose';
import User from './User.js';
import Article from './Article.js';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
    articleId: {
      type: mongoose.ObjectId,
      ref: Article,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    likes: [
      {
        userId: { type: mongoose.ObjectId, ref: User, required: true },
      },
    ],
    isModified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

commentSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

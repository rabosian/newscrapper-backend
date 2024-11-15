import mongoose from 'mongoose';
import User from './User.js';
import Article from './Article.js'

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
    like_count: { // 우선 카운트로 설정, 추후 시간되면 like table 따로 만들기
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
};

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

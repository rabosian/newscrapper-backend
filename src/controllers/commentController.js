import Article from '../models/Article.js';
import Comment from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const { userId } = req;
    const { articleId, contents } = req.body;
    const newComment = new Comment({
      userId,
      articleId,
      contents,
    });
    await newComment.save();
    await Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'failed', error: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { contents, likeRequest } = req.body;

    const findComment = await Comment.findById(id);
    if (!findComment) throw new Error('Comment not found');

    // likes 업데이트, likeRequest=true 이면 like 수정 기능 작동
    if (likeRequest) {
      const likedIndex = findComment.likes.findIndex((item) =>
        item.userId.equals(userId)
      );
      if (likedIndex === -1) {
        findComment.likes.push({ userId });
      } else {
        findComment.likes.splice(likedIndex, 1);
      }
    }

    // contents 업데이트
    if (contents) {
      if (!findComment.userId.equals(userId))
        throw new Error('Only comment creator can update');

      findComment.contents = contents;
    }

    await findComment.save();
    res.status(200).json({ status: 'success', findComment });
  } catch (err) {
    res.status(400).json({ status: 'failed', error: err.message });
  }
};

export const getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.query;
    const commentList = await Comment.find({ articleId })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', commentList });
  } catch (err) {
    res.status(400).json({ status: 'failed', error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const findComment = await Comment.findById(id);
    if (!findComment) throw new Error('Comment not found');

    if (!findComment.userId.equals(userId))
      throw new Error('Only comment creator can delete');

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'Failed', error: err.message });
  }
};

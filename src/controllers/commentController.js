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

    if (likeRequest) {
      // likes 업데이트, likeRequest=true 이면 like 수정 기능 작동
      const likedIndex = findComment.likes.findIndex((item) =>
        item.userId.equals(userId)
      );
      if (likedIndex === -1) {
        findComment.likes.push({ userId });
      } else {
        findComment.likes.splice(likedIndex, 1);
      }
      await findComment.save();
      res.status(200).json({ status: 'success', findComment });
    } else {
      // contents 업데이트
      if (contents) {
        if (!findComment.userId.equals(userId))
          throw new Error('Only comment creator can update');

        findComment.contents = contents;
        if (!findComment.isModified) findComment.isModified = true
        await findComment.save();
        res.status(200).json({ status: 'success', findComment });
      }
    }
    return;
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
        select: 'name picture',
      })
      .sort({ createdAt: -1 });

    const updatedCommentList = commentList.map((item) => ({
      ...item._doc,
      totalLike: item._doc.likes.length,
    }));

    res
      .status(200)
      .json({ status: 'success', commentList: updatedCommentList });
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

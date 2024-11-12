import User from '../models/User.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, level } = req.body;

    const existedUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existedUser) {
      if (existedUser.name === name && existedUser.email === email) {
        return res.status(400).json({
          status: 'fail',
          message: 'This account already in use',
        });
      } else if (existedUser.name === name) {
        return res.status(400).json({
          status: 'fail',
          message: 'This name already in use',
        });
      } else if (existedUser.email === email) {
        return res.status(400).json({
          status: 'fail',
          message: 'This email already in use',
        });
      }

      return res.status(400).json({
        status: 'fail',
        message: 'This account already in use',
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      level: level || 'user',
    });
    await newUser.save();
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

//Navbar에서 Favorite 페이지로 이동시
export const getUser = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'User unavailable' });
    }
    res.status(200).json({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};

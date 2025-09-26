import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { error } from 'console';

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  const exitingUser = await User.findOne({ email });

  if (exitingUser) {
    return next(new ApiError(400, 'User Exist'));
  }

  const newUser = new User({ username, email, password });
  const savedUser = await newUser.save;
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(401, 'Email Not Found'));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ApiError(401, 'Wrong Password'));
  }
  const token = generateToken(user._id);
  res.status(200).json({
    message: 'Login berhasil',
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
};

export { registerUser };
export { loginUser };

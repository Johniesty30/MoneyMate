import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email tidak ditemukan' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
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
  } catch (error) {
    res.status(500).json({ message: 'Gagal login', error });
  }
};

export { registerUser };
export { loginUser };

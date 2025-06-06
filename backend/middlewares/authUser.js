import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: 'Not Authorized login again' });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body ??= {};
    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser;

import jwt from 'jsonwebtoken';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { admintoken } = req.headers;

    if (!admintoken) {
      res
        .status(401)
        .json({ success: false, message: 'Not Authorized login again' });
    }

    const token_decode = jwt.verify(admintoken, process.env.JWT_SECRET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      res
        .status(401)
        .json({ success: false, message: 'Not Authorized login again' });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authAdmin;

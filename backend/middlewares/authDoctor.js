import jwt from 'jsonwebtoken';

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      res
        .status(401)
        .json({ success: false, message: 'Not Authorized login again' });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body ??= {};
    req.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authDoctor;

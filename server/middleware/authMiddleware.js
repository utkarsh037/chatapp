const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ message: "Access Denied. No Token Provided" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded;

    next();

  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
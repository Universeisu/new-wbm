const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("x-access-token"); // รับ token จาก header
  if (!token) {
    return res.status(401).json({ message: "Token is missing" }); // ไม่มี token
  }

  jwt.verify(token, process.env.MY_CUSTOM_JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Access Forbidden" }); // Token ไม่ถูกต้อง
    }

    // หาก token ถูกต้อง
    req.userId = decoded.id; // เก็บ userId ไว้ใน req
    req.username = decoded.username; // เก็บ username ไว้ใน req
    next(); // ไปยัง middleware หรือ route ถัดไป
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    console.log('TOKEN', token)

    if (!token) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    // Verifikasi JWT
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak valid atau kadaluwarsa",
          data: null,
        });
      }
      console.log('REQ USER', user)
      // simpan payload ke req
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error auth middleware:", error);
    return res.status(401).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });
  }
};
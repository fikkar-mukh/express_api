import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "./membership.model.js";
import { isValidEmail, isValidPassword } from "../../utils/validators.js";
import { JWT_SECRET } from "../../config/env.js";

// ===== REGISTRATION =====
export const registration = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // VALIDASI INPUT
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null,
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: 103,
        message: "Password minimal 8 karakter",
        data: null,
      });
    }

    // CEK APAKAH EMAIL UDAH ADA
    const existing = await findUserByEmail(req.db, email);
    if (existing)
      return res.status(400).json({
        status: 104,
        message: "Email sudah terdaftar",
        data: null,
      });

    // SIMPAN USER BARU
    const hashed = await bcrypt.hash(password, 10);
    await createUser(req.db, email, first_name, last_name, hashed);

    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Server Error", data: null });
  }
};

// === LOGIN ===
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDASI INPUT
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null,
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // CEK USER
    const user = await findUserByEmail(req.db, email);
    if (!user) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // CEK PASSWORD
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }
    // GENERATE JWT TOKEN
    console.log('MASUK ATUH', JWT_SECRET)
    const token = jwt.sign(
      { email: user.email, first_name: user.first_name, last_name: user.last_name }, // payload
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token },
    });
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

// === PROFIL ===
export const profile = async (req, res) => {
  try {
    console.log('REQ PROFILEEEEE', req.user)
    // Ambil email dari payload JWT
    const { email } = req.user;
    console.log('EMAILLLL', email)
        
    // ambil user berdasarkan email
    const [rows] = await req.db.query(
        "SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
        });
    }

    const user = rows[0];
    return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: user,
    });
  } catch (err) {
    console.error("Error profile:", err);
    return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const { first_name, last_name } = req.body;

    // Validasi input
    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 101,
        message: "Parameter first_name dan last_name wajib diisi",
        data: null,
      });
    }

    // Update ke database
    const [result] = await req.db.query(
      "UPDATE users SET first_name = ?, last_name = ? WHERE email = ?",
      [first_name, last_name, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 104,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    // Ambil data yg udah diupdate
    const [rows] = await req.db.query(
      "SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    return res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image || "https://yoururlapi.com/profile.jpeg",
      },
    });
  } catch (error) {
    console.error("Error update profile:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
}; 

// PROFILE IMAGE
export const profileImage = async (req, res) => {
  try {
    const email = req.user.email;

    // validasi jika multer menolak file
    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      });
    }

    // Dapatkan path file yang diupload
    const filename = req.file.filename;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${filename}`;

    // Update di database
    await req.db.query(
      "UPDATE users SET profile_image = ? WHERE email = ?",
      [imageUrl, email]
    );

    // Ambil data terbaru user
    const [rows] = await req.db.query(
      "SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    return res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error("Error upload image:", error);

    // response code khusus untuk format file
    if (error.message === "Format Image tidak sesuai" || error.status === 102) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};

export const testing = async (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Testing berhasil",
    data: null,
  });
}

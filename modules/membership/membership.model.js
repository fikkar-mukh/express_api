// import db from "../../config/db.js";

// Cek email
export const findUserByEmail = async (db, email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// Tambah user
export const createUser = async (db, email, first_name, last_name, passwordHash) => {
  await db.query(
    "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)",
    [email, first_name, last_name, passwordHash, 0]
  );
};
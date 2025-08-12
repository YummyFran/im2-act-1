const db = require("../config/db");

const signup = async ({ uid, fname, lname, age, email, hashedPassword }) => {
  await db.execute(
    `INSERT INTO users (uid, fname, lname, age, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
    [uid, fname, lname, age, email, hashedPassword]
  );

  const [user] = await db.query(
    `SELECT uid, fname, lname, age, email, password, created_at FROM users WHERE uid = ?`,
    [uid]
  );

  return user;
};

const findUserByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();

  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    normalized,
  ]);

  return rows[0];
};

module.exports = {
  signup,
  findUserByEmail,
};

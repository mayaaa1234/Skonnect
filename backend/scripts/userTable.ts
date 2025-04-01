import pool from "../src/db/pool.ts";

const createUsersTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(55) NOT NULL UNIQUE CHECK (CHAR_LENGTH(username) >= 4),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(password) >= 8),
        isAdmin BOOLEAN DEFAULT FALSE
      )
    `);

    console.log("user table ✅");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
};

export default createUsersTable;

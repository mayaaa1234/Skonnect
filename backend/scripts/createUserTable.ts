import mysql from "mysql2/promise";
import pool from "../pool.ts";
import dotenv from "dotenv";
dotenv.config();

const createUsersTable = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(55) NOT NULL CHECK (CHAR_LENGTH(username) >= 8),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(password) >= 8),
        isAdmin BOOLEAN DEFAULT FALSE
      )
    `);
    console.log("Users table created successfully.");
    connection.release();
    process.exit();
  } catch (error) {
    console.error("Error creating users table:", error);
    process.exit(1);
  }
};

createUsersTable();

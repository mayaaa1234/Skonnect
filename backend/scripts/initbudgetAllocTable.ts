import pool from "../src/db/pool.ts";
import path from "path";

const createAnnualBudgetAllocationsTable = async () => {};

// -- 1. If you ever want multiple budgets (e.g. for different years or departments):
// CREATE TABLE budgets (
//   id           INT          AUTO_INCREMENT PRIMARY KEY,
//   name         VARCHAR(100) NOT NULL,           -- e.g. 'SK Budget for CY 2025'
//   fiscal_year  YEAR         NOT NULL,
//   created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
// );
//
// -- 2. A lookup table for your categories (prevents typos & makes renames easy)
// CREATE TABLE categories (
//   id    INT          AUTO_INCREMENT PRIMARY KEY,
//   name  VARCHAR(100) NOT NULL UNIQUE              -- e.g. 'Expenditures', 'Office Needs', etc.
// );
//
// -- 3. The actual line items
// CREATE TABLE budget_items (
//   id           INT           AUTO_INCREMENT PRIMARY KEY,
//   budget_id    INT           NOT NULL,
//   category_id  INT           NOT NULL,
//   amount       DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
//   description  TEXT          NOT NULL,
//   FOREIGN KEY (budget_id)   REFERENCES budgets(id)    ON DELETE CASCADE,
//   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
// );

import { RowDataPacket } from "mysql2";
import type { Request, Response, NextFunction } from "express";
import pool from "../db/pool.ts";
import mkCustomError from "../errors/CustomError.ts";

const add = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    throw mkCustomError({ status: 404, msg: "No data to be added found." });
  }

  const { category, items } = req.body;
  let amount = req.body.amount;
  amount = Number(String(amount).replace(/,/g, "")); // rm commas if any

  if (!Number.isInteger(amount)) {
    throw mkCustomError({ status: 400, msg: "Invalid amount value/format" });
  }

  if (category.length >= 55) {
    throw mkCustomError({
      status: 400,
      msg: "Category length must not exceed 55 characters",
    });
  }

  if (items.length >= 105) {
    throw mkCustomError({
      status: 400,
      msg: "Items length must not exceed 105 characters",
    });
  }

  console.log("amount: ", amount);
  await pool.execute(
    "INSERT INTO annual_budget_allocation (category, amount, items) VALUES (?, ?, ?)",
    [category, amount, items],
  );

  res.json({ msg: "ok" });
};

const deleteRow = async (req: Request, res: Response) => {
  const { id, category, amount, items } = req.params;

  await pool.execute("DELETE FROM annual_budget_allocation WHERE id = ?", [id]);

  res.json({ msg: "ok" });
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, amount, items } = req.body;

  if (!id || !category || !amount || !items) {
    throw mkCustomError({
      status: 400,
      msg: "Missing vals for update row",
    });
  }

  if (!Number.isInteger(Number(String(amount).replace("/,/g", "")))) {
    throw mkCustomError({
      status: 400,
      msg: "Invlid amount value / format",
    });
  }

  await pool.execute(
    "UPDATE annual_budget_allocation SET category = ?, amount = ?, items = ? WHERE id = ?",
    [category, amount, items, id],
  );
  res.json({ msg: "ok" });
};

const getAll = async (_req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM annual_budget_allocation",
  );

  res.json(rows);
};

export { getAll, update, add, deleteRow };

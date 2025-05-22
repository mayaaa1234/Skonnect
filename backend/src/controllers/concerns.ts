import { RowDataPacket, ResultSetHeader } from "mysql2";
import type { Request, Response, NextFunction } from "express";
import pool from "../db/pool.ts";
import mkCustomError from "../errors/CustomError.ts";

// GET / – all concerns with their status & responses
export const getAllConcerns = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT 
       c.id,
       c.message,
       c.concern_owner_email,
       c.concern_owner_username,
       caa.response,
       caa.status
     FROM concerns c
     JOIN concerns_admin_action caa ON c.id = caa.concern_id`,
  );
  res.json(rows);
};

// POST / – user concern submission
export const submitConcern = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    throw mkCustomError({ status: 400, msg: "No data provided." });
  }

  const { message } = req.body;
  const { email: concern_owner_email, username: concern_owner_username } =
    req.user!;

  console.log("submit concern msg: ", message);
  if (!concern_owner_email || !concern_owner_username) {
    throw mkCustomError({ status: 400, msg: "Missing user info from token" });
  }

  if (!message || typeof message !== "string") {
    throw mkCustomError({
      status: 400,
      msg: "Message is required",
    });
  }

  if (message.length > 2000) {
    throw mkCustomError({
      status: 400,
      msg: "Message must be ≤ 2000 characters.",
    });
  }

  // Insert into concerns
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO concerns
       (message, concern_owner_email, concern_owner_username)
     VALUES (?, ?, ?)`,
    [message, concern_owner_email, concern_owner_username],
  );
  console.log({ result });
  const concernId = result.insertId;

  await pool.execute<ResultSetHeader>(
    "INSERT INTO concerns_admin_action (concern_id) VALUES (?)",
    [concernId],
  );

  res.status(201).json({ id: concernId });
};

// PATCH / - update concern status
export async function updateConcernStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { newStatus, adminResponse } = req.body;

  console.log("DEBUG newStatus:", newStatus);

  if (!id) {
    throw mkCustomError({ status: 400, msg: "Missing required id parameter" });
  }

  if (typeof newStatus !== "string" || newStatus.trim() === "") {
    throw mkCustomError({
      status: 400,
      msg: "Missing or invalid newStatus parameter",
    });
  }

  const validStatuses = [
    "default",
    "rejected",
    "acknowledged",
    "in_progress",
    "resolved",
  ];
  if (!validStatuses.includes(newStatus)) {
    throw mkCustomError({ status: 400, msg: "Invalid Status" });
  }

  await pool.execute(
    `
    UPDATE concerns_admin_action
    SET status = ?, response = ?
    WHERE concern_id = ?
    `,
    [newStatus, adminResponse ?? null, id],
  );

  res.json({ msg: "success" });
}

export async function deleteConcern(req: Request, _res: Response) {
  await pool.execute(
    `DELETE FROM concerns WHERE id = ?`,
    [req.params.id],
  )
}

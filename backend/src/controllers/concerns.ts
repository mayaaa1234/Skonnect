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
       cs.rejected,
       cs.acknowledged,
       cs.in_progress,
       cs.resolved,
       cr.rejected_response,
       cr.resolved_response
     FROM concerns c
     JOIN concerns_status cs ON c.id = cs.concern_id
     JOIN concerns_response cr ON c.id = cr.concern_id`,
  );
  res.json(rows);
};

// POST / – create new concern
export const submitConcern = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    throw mkCustomError({ status: 400, msg: "No data provided." });
  }

  if (!req.user) {
    throw mkCustomError({ status: 401, msg: "User not authenticated" });
  }

  const { message } = req.body;
  const { email: concern_owner_email, username: concern_owner_username } =
    req.user;

  if (!concern_owner_email || !concern_owner_username) {
    throw mkCustomError({ status: 400, msg: "Missing user info from token" });
  }
  if (!message || typeof message !== "string" || message.length > 2000) {
    throw mkCustomError({
      status: 400,
      msg: "Message is required and must be ≤ 2000 characters.",
    });
  }

  if (
    !concern_owner_email ||
    typeof concern_owner_email !== "string" ||
    concern_owner_email.length > 100
  ) {
    throw mkCustomError({
      status: 400,
      msg: "Email is required and must be ≤ 100 characters.",
    });
  }

  if (
    !concern_owner_username ||
    typeof concern_owner_username !== "string" ||
    concern_owner_username.length > 55
  ) {
    throw mkCustomError({
      status: 400,
      msg: "Username is required and must be ≤ 55 characters.",
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
    "INSERT INTO concerns_status (concern_id) VALUES (?)",
    [concernId],
  );

  await pool.execute<ResultSetHeader>(
    "INSERT INTO concerns_response (concern_id) VALUES (?)",
    [concernId],
  );

  res.status(201).json({ id: concernId });
};

// PUT /:id/reject
export const rejectConcern = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { response } = req.body;

  if (!id) {
    throw mkCustomError({ status: 400, msg: "Concern ID is required." });
  }
  if (!response || typeof response !== "string" || response.length > 2000) {
    throw mkCustomError({
      status: 400,
      msg: "Rejection response is required and must be ≤ 2000 characters.",
    });
  }

  await pool.execute<ResultSetHeader>(
    `UPDATE concerns_status
       SET rejected = 1
     WHERE concern_id = ?`,
    [id],
  );

  await pool.execute<ResultSetHeader>(
    `UPDATE concerns_response
       SET rejected_response = ?
     WHERE concern_id = ?`,
    [response, id],
  );

  res.json({ msg: "ok" });
};

// PUT /:id/acknowledge
export const acknowledgeConcern = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw mkCustomError({ status: 400, msg: "Concern ID is required." });
  }

  await pool.execute<ResultSetHeader>(
    `UPDATE concerns_status
       SET acknowledged = 1
     WHERE concern_id = ?`,
    [id],
  );
  res.json({ msg: "ok" });
};

// PUT /:id/process
export const processConcern = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw mkCustomError({ status: 400, msg: "Concern ID is required." });
  }

  await pool.execute<ResultSetHeader>(
    `UPDATE concerns_status
       SET in_progress = 1
     WHERE concern_id = ?`,
    [id],
  );
  res.json({ msg: "ok" });
};

// PUT /:id/resolve
export const resolveConcern = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { response } = req.body;

  if (!id) {
    throw mkCustomError({ status: 400, msg: "Concern ID is required." });
  }
  if (!response || typeof response !== "string" || response.length > 2000) {
    throw mkCustomError({
      status: 400,
      msg: "Resolution response is required and must be ≤ 2000 characters.",
    });
  }

  await pool.execute<ResultSetHeader>(
    `UPDATE concerns_status
       SET resolved = 1
     WHERE concern_id = ?`,
    [id],
  );

  await pool.execute<ResultSetHeader>(
    `UPDATE concerns_response
       SET resolved_response = ?
     WHERE concern_id = ?`,
    [response, id],
  );

  res.json({ msg: "ok" });
};

// GET /rejected
export const getRejectedConcerns = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT c.*, cr.rejected_response
     FROM concerns c
     JOIN concerns_status cs ON c.id = cs.concern_id AND cs.rejected = 1
     JOIN concerns_response cr ON c.id = cr.concern_id`,
  );
  res.json(rows);
};

// GET /resolved
export const getResolvedConcerns = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT c.*, cr.resolved_response
     FROM concerns c
     JOIN concerns_status cs ON c.id = cs.concern_id AND cs.resolved = 1
     JOIN concerns_response cr ON c.id = cr.concern_id`,
  );
  res.json(rows);
};

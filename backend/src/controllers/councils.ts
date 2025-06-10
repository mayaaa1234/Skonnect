import { Request, Response } from "express";
import mkCustomError from "errors/CustomError.ts";
import pool from "../db/pool.ts";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import imageType from "image-type";

const deleteCouncilImg = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw mkCustomError({ status: 400, msg: "Image ID is required." });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM council_slideshow_images WHERE id = ?`,
    [id],
  );

  if (result.affectedRows === 0) {
    throw mkCustomError({ status: 404, msg: "Image not found." });
  }

  res.json({ success: true });
};

const uploadCouncilImgs = async (req: Request, res: Response) => {
  const files = req.files;

  if (!Array.isArray(files) || files.length === 0) {
    throw mkCustomError({ status: 400, msg: "No files uploaded." });
  }

  await Promise.all(
    files.map((f) =>
      pool.execute(`INSERT INTO council_slideshow_images (image) VALUES (?)`, [
        f.buffer,
      ]),
    ),
  );

  res.json({ success: true });
};

const getAllImgsURL = async (_req: Request, res: Response) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM council_slideshow_images ORDER BY id ASC`,
  );

  const urls = rows.map((row) => {
    return {
      url: `api/v1/councils/image/${row.id}`,
      id: row.id,
    };
  });

  res.send(urls);
};

const getCouncilImg = async (_req: Request, res: Response) => {
  const { id } = _req.params;

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT image FROM council_slideshow_images WHERE id = ? LIMIT 1`,
    [id],
  );

  const imgBuf = rows[0].image;
  const type = await imageType(imgBuf);
  if (!type) {
    throw mkCustomError({ status: 400, msg: "Could not determine image type" });
  }

  res.setHeader("Content-Type", type.mime);
  res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
  res.setHeader("Content-Length", imgBuf.length);
  res.send(imgBuf);
};

export { deleteCouncilImg, uploadCouncilImgs, getAllImgsURL, getCouncilImg };

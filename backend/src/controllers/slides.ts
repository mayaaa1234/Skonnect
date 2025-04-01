import { Request, Response } from "express";
import pool from "../db/pool.ts";
import mkCustomError from "../errors/CustomError.ts";
import { RowDataPacket } from "mysql2";
// import getImageDataUrl from "../utils/getImgDataUrl.ts";
import imageType from "image-type";

//WARN: not sure if I should enforce purely multiple image uploads
//right now it's possible upload just a single img

export async function uploadSlideshow(req: Request, res: Response) {
  const { caption } = req.body;

  if (!caption) {
    throw mkCustomError({ status: 400, msg: "Missing caption" });
  }

  if (!req.files) {
    throw mkCustomError({ status: 400, msg: "No files uploaded." });
  }

  const files = Array.isArray(req.files) //when using upload.array in multer
    ? req.files
    : //OR if using upload.field in multer
      //it's typed as: { [fieldname: string]: Express.Multer.File[] }
      Object.values(req.files || {}).flat();

  if (files.length === 0) {
    throw mkCustomError({ status: 400, msg: "No files found." });
  }

  // insert slideshow metadata into "slideshows table".
  // for now it's only caption (might add later)
  const [result] = await pool.execute(
    "INSERT INTO slideshows (caption) VALUES (?)",
    [caption],
  );

  // assuming result has id property from sql auto increment
  const slideshowId = (result as any).insertId;

  // insert each image into the "slideshow_images" table.
  for (const file of files) {
    await pool.execute(
      "INSERT INTO slideshow_images (slideshow_id, image) VALUES (?, ?)",
      [slideshowId, file.buffer],
    );
  }

  res.status(200).json({ success: true });
}

export async function updateSlideshow(req: Request, res: Response) {
  const { id } = req.params;
  const { caption } = req.body;

  if (!req.files) {
    throw mkCustomError({ status: 400, msg: "No files uploaded." });
  }

  const files = Array.isArray(req.files) //when using upload.array in multer
    ? req.files
    : //OR if using upload.field in multer
      //it's typed as: { [fieldname: string]: Express.Multer.File[] }
      Object.values(req.files || {}).flat();

  if (files.length === 0) {
    throw mkCustomError({ status: 400, msg: "No files found." });
  }

  await pool.execute("UPDATE slideshows SET caption = ? WHERE id = ?", [
    caption,
    id,
  ]);

  // remove previous blobs
  await pool.execute("DELETE FROM slideshow_images WHERE slideshow_id = ?", [
    id,
  ]);

  //insert the new blobs.
  for (const file of files) {
    await pool.execute(
      "INSERT INTO slideshow_images (slideshow_id, image) VALUES (?, ?)",
      [id, file.buffer],
    );
  }

  res.status(200).json({ success: true });
}

// INFO: this fn does not send the actual img binary, it only send the metadata
// and an api reference to then be called (@ getSlideshowImage) to actually get the img

export async function getAllSlideshows(_req: Request, res: Response) {
  // first get all slideshow metadata
  const [slideshows] = await pool.execute<RowDataPacket[]>(`
      SELECT id, caption FROM slideshows
      ORDER BY id DESC
    `);
  console.log({ slideshows });

  // get all images id
  const [images] = await pool.execute<RowDataPacket[]>(`
      SELECT id, slideshow_id FROM slideshow_images
      ORDER BY slideshow_id
    `);
  console.log({ images });

  // structure the response with image references
  const response = slideshows.map((slideshow) => ({
    id: slideshow.id,
    caption: slideshow.caption,
    images: images
      .filter((img) => img.slideshow_id === slideshow.id)
      .map((img) => ({
        id: img.id,
        url: `/api/slideshows/images/${img.id}`, // frontend will fetch this
      })),
  }));

  console.log({ response });
  res.json(response);
}

export async function getSlideshowImage(req: Request, res: Response) {
  const { imageId } = req.params;

  if (!Number.isInteger(Number(imageId))) {
    throw mkCustomError({ status: 400, msg: "Invalid image ID format" });
  }

  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT image FROM slideshow_images WHERE id = ?",
    [imageId],
  );

  if (!rows.length || !rows[0].image) {
    throw mkCustomError({ status: 400, msg: "Image not found." });
  }

  const imageBuffer = rows[0].image;

  // detect image type
  const type = await imageType(imageBuffer);
  if (!type) {
    throw mkCustomError({ status: 400, msg: "Could not determine image type" });
  }

  // set proper headers and send the image
  res.setHeader("Content-Type", type.mime);
  res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
  res.setHeader("Content-Length", imageBuffer.length);
  res.send(imageBuffer);
}

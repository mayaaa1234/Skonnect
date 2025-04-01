import pool from "../src/db/pool.ts";
import path from "path";

const createSlideShowTable = async () => {
  try {
    //metadata and blob
    await pool.query(`
  CREATE TABLE IF NOT EXISTS slideshows ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    caption VARCHAR(255) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS slideshow_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slideshow_id INT,
    image LONGBLOB NOT NULL,
    FOREIGN KEY (slideshow_id) REFERENCES slideshows(id) ON DELETE CASCADE
  );
`);
    console.log("slideshow table ✅");

    // check if sample slideshow data exists
    const [rows]: any = await pool.execute("SELECT id FROM slideshows LIMIT 1");

    if (rows.length === 0) {
      // insert sample slideshow
      const [result]: any = await pool.execute(
        `INSERT INTO slideshows (caption) VALUES (?)`,
        ["Clean-up Drive"],
      );

      const slideshowId = result.insertId; // get inserted slideshow ID

      // insert sample images for this slideshow.
      // convert image paths to absolute paths ()
      const images = [
        "frontend/public/sk-data/clean-1.webp",
        "frontend/public/sk-data/clean-2.webp",
        "frontend/public/sk-data/clean-3.webp",
      ].map((img) => path.resolve(process.cwd(), img));

      for (const image of images) {
        await pool.execute(
          `INSERT INTO slideshow_images (slideshow_id, image) VALUES (?, ?)`,
          [slideshowId, image],
        );
      }

      console.log("✅ Sample slideshow and images inserted");
    }
  } catch (error) {
    console.error("❌ Error creating slideshows table:", error);
  }
};

export default createSlideShowTable;

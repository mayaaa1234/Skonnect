// import imageType from "image-type";
//
// // INFO :
// // detect the mime type,
// // convert the image buffer to a base64 string, then
// // return the full data URL with the correct MIME typ and base64 string.
//
// const getImageDataUrl = async (imageBuffer: Buffer): Promise<string | null> => {
//   const type = await imageType(imageBuffer);
//
//   if (!type) {
//     return null;
//   }
//
//   const base64Image = imageBuffer.toString("base64");
//
//   return `data:image/${type.mime};base64,${base64Image}`;
// };
//
// export default getImageDataUrl;
//

import initSlideShow from "./events.ts";
import renderSlides from "./ui.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await renderSlides();
  initSlideShow();
});

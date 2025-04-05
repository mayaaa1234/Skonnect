import "./fetchSlides.ts";
import loadSlideshows from "./slidesDOM";
import initSlideIndexesAndEvents from "./slideEvents.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSlideshows();
  await initSlideIndexesAndEvents();
});

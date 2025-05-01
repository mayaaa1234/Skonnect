// import "./fetchSlides.ts";
import loadSlideshows from "./slidesDOM.ts";
import initSlideIndexesAndEvents from "./slideEvents.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSlideshows();
  await initSlideIndexesAndEvents();
});

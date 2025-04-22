// import "./fetchSlides.ts";
import loadSlideshows from "./slidesDOM";
import initSlideIndexesAndEvents from "./slideEvents.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSlideshows();
  await initSlideIndexesAndEvents();
});

document.addEventListener("DOMContentLoaded", async () => {
  const annual = document.querySelector(".annual") as HTMLElement;
  const concern = document.querySelector(".concern") as HTMLElement;
  const council = document.querySelector(".council") as HTMLElement;
  const events = document.querySelector(".events") as HTMLElement;

  annual.onclick = () => (location.href = "/annual-budget-allocation");
  concern.onclick = () => (location.href = "/concerns-or-suggestions");
  council.onclick = () => (location.href = "/council-information");
  events.onclick = () => (location.href = "/projects-and-events");
});

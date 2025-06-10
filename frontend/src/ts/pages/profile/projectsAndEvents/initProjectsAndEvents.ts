import openProjectsAndEventsData from "./openProjectsAndEvents.ts";
// import initSlideIndexesAndEvents from "../../projectsAndEvents/slideShow/slideEvents.ts";
import uploadEventListener from "./upload.ts";
import deleteSlideshowEventListener from "./delete.ts";

import onDOMReady from "../../../utils/onDOMReady.ts";

export default async function initProjectsAndEventsPage() {
  onDOMReady(async () => {
    await openProjectsAndEventsData();
    // await initSlideIndexesAndEvents();
    uploadEventListener();
    await deleteSlideshowEventListener();
  });
}

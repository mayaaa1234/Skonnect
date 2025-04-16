import openProjectsAndEventsData from "./openProjectsAndEvents.ts";
import initSlideIndexesAndEvents from "../../home/slideShow/slideEvents.ts";
import uploadEventListener from "./upload.ts";
import deleteSlideshowEventListener from "./delete.ts";

import onDOMReady from "../../../utils/onDOMReady";

export default async function initProjectsAndEventsPage() {
  onDOMReady(async () => {
    await openProjectsAndEventsData();
    await initSlideIndexesAndEvents();
    await uploadEventListener();
    await deleteSlideshowEventListener();
  });
}

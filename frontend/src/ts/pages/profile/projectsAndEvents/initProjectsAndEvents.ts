import openProjectsAndEventsData from "./openProjectsAndEvents.ts";
import uploadEventListener from "./upload.ts";
import onDOMReady from "../../../utils/onDOMReady";

export default async function initProjectsAndEventsPage() {
  onDOMReady(async () => {
    await openProjectsAndEventsData();
    await uploadEventListener();
  });
}

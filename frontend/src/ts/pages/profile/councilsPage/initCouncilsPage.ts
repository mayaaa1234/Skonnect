import onDOMReady from "@utils/onDOMReady.ts";
import openCouncilPage from "./page.ts";
import initEvents from "./events.ts";

const initCouncilsPage = async () => {
  onDOMReady(async () => {
    await openCouncilPage();
    initEvents();
  });
};

export default initCouncilsPage;

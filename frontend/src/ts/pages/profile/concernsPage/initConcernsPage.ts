import { loadDOM } from "./UI.ts";
import { initEvents, highlightStatusBtnsOnLoad } from "./events.ts";

export default async function initConcernsPage() {
  await loadDOM();
  highlightStatusBtnsOnLoad();
  initEvents();
}

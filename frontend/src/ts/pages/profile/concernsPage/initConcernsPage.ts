import { loadDOM } from "./UI.ts";
import { initEvents } from "./events.ts";
import { initTogleResponseBtnEvents } from "./utils.ts";

export default async function initConcernsPage() {
  await loadDOM();
  initEvents();
  initTogleResponseBtnEvents();
}

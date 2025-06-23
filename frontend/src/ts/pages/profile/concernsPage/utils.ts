import { DEFAULT_CONCERN_STATUS } from "./constants.ts";
import { Concern } from "./api.ts";

const openPopup = () => {
  const overlay = document.querySelector(".status-details-popup-overlay");
  if (!overlay) {
    console.log("cant find overlay");
    return;
  }
  overlay.classList.add("show");
};

const populateConcernDetails = (id: number) => {
  const textarea = document.querySelector(
    ".concern-response-textarea",
  ) as HTMLTextAreaElement;
  const prevSelectedBtn = document.querySelector(".status-btn.selected");
  if (!prevSelectedBtn || !textarea) return;

  prevSelectedBtn.classList.remove("selected");
  textarea.value = "";

  const concernRaw = sessionStorage.getItem("concerns");
  const concerns: Concern[] = concernRaw ? JSON.parse(concernRaw) : [];

  if (!concerns) {
    console.log("no concerns found in sessionStorage");
    return;
  }

  const concern = concerns.find((c: Concern) => c.id === id);
  const { response, status } = concern || {};

  const btn = document.querySelector(
    `.status-btn[data-action='${status ?? DEFAULT_CONCERN_STATUS}']`,
  ) as HTMLButtonElement;

  if (!btn) {
    console.log("cant find btn or textarea");
    return;
  }

  btn.classList.add("selected");
  console.log({ response, status });
  textarea.value = response ?? "";
};

function highlightSelectedStatusBtn(btn: HTMLButtonElement): void {
  console.log("click");

  const prevSelectedBtn = document.querySelector<HTMLButtonElement>(
    ".status-btn.selected",
  );
  const prevSelectedStatus =
    prevSelectedBtn?.dataset.action ?? DEFAULT_CONCERN_STATUS;

  if (!prevSelectedBtn || !prevSelectedStatus) {
    console.log("no prev selected or dataset found");
    return;
  }

  const currSelectedStatus = btn.dataset.action ?? DEFAULT_CONCERN_STATUS;

  // if user clicks the same status button do nothing
  if (prevSelectedStatus === currSelectedStatus) return;

  removeBtnHighlight(prevSelectedBtn);

  btn.classList.add("selected");
  sessionStorage.setItem("currentSelectedStatus", currSelectedStatus);
}

function removeBtnHighlight(btn: HTMLButtonElement): void {
  btn.classList.remove("selected");
}

function closePopup() {
  const overlay = document.querySelector(".status-details-popup-overlay");
  overlay?.classList.remove("show");
  sessionStorage.removeItem("currentSelectedStatus");
  sessionStorage.removeItem("currentConcernId");
}

const formatStatus = (status: string) =>
  status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const renderCurrentStatus = (status: Concern["status"]) => {
  let statusCircle = "";

  switch (status) {
    case "rejected":
      statusCircle = `<span
        class="acknowledged bgc-mac-red concern-popup-circle"
      ></span>`;
      break;
    case "acknowledged":
      statusCircle = `<span class="acknowledged bgc-mac-blue concern-popup-circle"></span>`;
      break;
    case "in_progress":
      statusCircle = `<span class="in-progress bgc-progress concern-popup-circle"></span>`;
      break;
    case "resolved":
      statusCircle = `<span class="resolved bgc-mac-green concern-popup-circle"></span>`;
      break;
    default:
      statusCircle = `<span class="resolved bgc-gray concern-popup-circle"></span>`;
  }

  return statusCircle;
};

function initTogleResponseBtnEvents() {
  document.addEventListener("click", (e: Event) => {
    const t = e.target as HTMLElement;
    const btn = t.closest(".toggle-response-btn") as HTMLButtonElement | null;
    if (!btn) return;

    const wrapper = btn.closest(".response-wrapper") as HTMLElement | null;
    if (!wrapper) return;

    const content = wrapper.querySelector(
      ".response-content",
    ) as HTMLElement | null;
    if (!content) return;

    const isVisible = content.classList.contains("show");
    content.classList.toggle("show");
    btn.textContent = isVisible ? "View response" : "Hide response";
  });
}

export {
  initTogleResponseBtnEvents,
  populateConcernDetails,
  highlightSelectedStatusBtn,
  openPopup,
  closePopup,
  removeBtnHighlight,
  formatStatus,
  renderCurrentStatus,
};

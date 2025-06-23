import { Concern, fetchAllConcerns } from "./api.ts";
import { DEFAULT_CONCERN_STATUS } from "./constants.ts";
import { updateConcernDetails, deleteConcern } from "./api.ts";
import { renderAsideList, loadDOM } from "./UI.ts";
import {
  populateConcernDetails,
  openPopup,
  highlightSelectedStatusBtn,
  closePopup,
  renderCurrentStatus,
  formatStatus,
} from "./utils.ts";
import session from "express-session";
import { notifyError } from "@utils/showNotif.ts";
import html from "@utils/htmlTemp.ts";

const container = document.getElementById("data-container") as HTMLDivElement;

// Event Delegation

// const storedConcerns = JSON.parse(localStorage.getItem("concerns") || "[]");

async function initEvents() {
  document.body.addEventListener("click", async (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // INFO: Concern Status Control Events

    // Open popup
    const openPopupBtn = target.closest(".open-details-popup") as HTMLElement;
    if (openPopupBtn) {
      const currentStatus =
        openPopupBtn.closest<HTMLDivElement>(".pre-ctrl")?.dataset.status ??
        DEFAULT_CONCERN_STATUS;
      const id = openPopupBtn.dataset.statusId;

      openPopup();
      if (id) sessionStorage.setItem("currentConcernId", id);
      populateConcernDetails(Number(id));
    }

    // Close popup
    const cancelPopupBtn = target.closest(
      ".cancel-status-popup-btn",
    ) as HTMLButtonElement;
    const closePopupBtn = target.closest(
      ".close-status-popup-btn",
    ) as HTMLButtonElement;
    if (closePopupBtn || cancelPopupBtn) closePopup();

    // Changing status inside popup
    const statusBtn = target.closest<HTMLButtonElement>(".status-btn");
    if (statusBtn) highlightSelectedStatusBtn(statusBtn);

    // Save changes inside popup
    const saveBtn = target.closest(
      ".save-status-popup-btn",
    ) as HTMLButtonElement;
    if (saveBtn) {
      const textarea = document.querySelector(
        ".concern-response-textarea",
      ) as HTMLTextAreaElement;
      const selectedBtn = document.querySelector(
        ".status-btn.selected",
      ) as HTMLButtonElement;

      if (!selectedBtn || !textarea) return;

      const status = selectedBtn.dataset.action as Concern["status"];
      const response = textarea.value;

      const rawId = sessionStorage.getItem("currentConcernId");
      const concernId = rawId ? Number(rawId) : null;
      if (concernId === null || isNaN(concernId)) {
        console.log("No current concern ID found in sessionStorage.");
        return;
      }

      try {
        await updateConcernDetails(concernId, response, status);
        await loadDOM(); // relfect changes
        closePopup();
        const cit = document.querySelector(
          ".concern-item-header",
        ) as HTMLSpanElement;
        if (cit)
          cit.innerHTML = `${renderCurrentStatus(status)}  ${formatStatus(status)}`;
      } catch (err) {
        console.error(err);
        notifyError("Something went wrong please try again.");
        closePopup();
      }

      const overlay = document.querySelector(".status-details-popup-overlay");
      overlay?.classList.remove("show");
    }

    // Delete concern
    const dc = target.closest<HTMLElement>(".del-concern");
    if (dc) {
      const id = dc.dataset.statusId;
      if (!id) return;

      dc.closest<HTMLDivElement>("li.concern-item")?.remove();

      const asideItem = document.querySelector(
        `.aside-concern-item[data-status-id="${id}"]`,
      );
      asideItem?.remove();

      try {
        await deleteConcern(Number(id));
      } catch (err) {
        console.error("Failed to delete concern:", err);
        notifyError("Failed to delete. Please try again.");
      }
    }

    // INFO: Aside Box Events
    const asideBtn = target.closest<HTMLElement>(".concern-status");
    if (asideBtn) {
      console.log("click");
      const viewControls = asideBtn.closest(
        ".concern-view-controls",
      ) as HTMLDivElement;

      if (!viewControls) return;

      const prev = viewControls.querySelector(".selected");
      prev?.classList.remove("selected");

      asideBtn.classList.add("selected");
      const status = asideBtn.dataset.status as Concern["status"];

      await openAsideConcernStatus(status);
    }
  });
}

// WARN: this is where i left. gon fix this tomm
// also ig put the aside style (css) into util class so that the other page can use it
async function openAsideConcernStatus(status: Concern["status"]) {
  try {
    const concerns: Concern[] = await fetchAllConcerns();

    const viewStatusContainer = document.querySelector(
      ".aside-concern-view-status",
    ) as HTMLElement;
    viewStatusContainer.innerHTML = "";

    viewStatusContainer.innerHTML = `
      ${renderAsideList(concerns, status)}
      `;
  } catch (error) {
    console.log(error);
  }
}

const refreshAside = async () => {
  const vc = document.querySelector(".concern-view-controls") as HTMLElement;
  const asideSelected = vc.querySelector(".selected") as HTMLElement;
  const asideOpenedStatus = asideSelected?.dataset.status as Concern["status"];
  await openAsideConcernStatus(asideOpenedStatus);
};

export { initEvents, openAsideConcernStatus };

import { Concern, fetchAllConcerns } from "./api.ts";
import { DEFAULT_CONCERN_STATUS, STATUS_BUTTONS } from "./constants.ts";
import { updateConcernStatusToDB, deleteConcern } from "./api.ts";
import { renderConcernList } from "./UI.ts";

const container = document.getElementById("data-container") as HTMLDivElement;

function highlightStatusBtnsOnLoad(): void {
  document
    .querySelectorAll<HTMLDivElement>(".concern-controls")
    .forEach((cc) => {
      const status = cc.dataset.currentStatus || DEFAULT_CONCERN_STATUS;
      const btn = cc.querySelector(`[data-action="${status}"]`);
      btn?.classList.add("selected");
      console.log("hightlighted btn", btn);
    });
}

function highlighSelectedStatusBtn(
  btn: HTMLButtonElement,
  revert?: "revertUI",
): void {
  const cc = btn.closest<HTMLDivElement>(".concern-controls")!;
  const selectedStatus = btn.dataset.action as Concern["status"];
  const currentStatus = cc.dataset.currentStatus as Concern["status"];

  // If reverting, restore previous UI state
  if (revert === "revertUI") {
    const prevBtn = cc.querySelector<HTMLButtonElement>(".selected");
    btn.classList.remove("selected");
    prevBtn?.classList.add("selected");
    return;
  }

  if (selectedStatus === currentStatus) return;

  // Update UI and values
  const prevBtn = cc.querySelector<HTMLButtonElement>(".selected");
  prevBtn?.classList.remove("selected");
  btn.classList.add("selected");
  cc.dataset.currentStatus = selectedStatus;
}

async function openAsideConcernStatus(status: Concern["status"]) {
  try {
    const concerns: Concern[] = await fetchAllConcerns();

    const viewStatusContainer = document.querySelector(
      ".aside-concern-view-status",
    ) as HTMLElement;
    viewStatusContainer.innerHTML = "";

    viewStatusContainer.innerHTML = `
      ${renderConcernList(concerns, status)}
      `;
  } catch (error) {
    console.log(error);
  }
}
//
async function initEvents() {
  container.addEventListener("click", async (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // INFO: Concern Status Control Events
    const statusBtn = target.closest<HTMLButtonElement>(".status-btn");
    if (statusBtn) {
      const sc = statusBtn.closest(".concern-controls") as HTMLDivElement;
      const id = Number(sc.dataset.statusId) as Concern["id"];

      if (statusBtn.dataset.action === "delete") {
        statusBtn.closest<HTMLDivElement>("li")?.remove();
        deleteConcern(id);

        // refresh opened aside concern status for UI update
        const vc = document.querySelector(
          ".concern-view-controls",
        ) as HTMLElement;
        const asideSelected = vc.querySelector(".selected") as HTMLElement;
        const asideOpenedStatus = asideSelected?.dataset
          .status as Concern["status"];
        await openAsideConcernStatus(asideOpenedStatus);

        return;
      }

      const newStatus = statusBtn.dataset.action as Concern["status"];

      if (!id || !newStatus) {
        console.log("datasets not found.");
        return;
      }

      try {
        await updateConcernStatusToDB(id, newStatus);
        highlighSelectedStatusBtn(statusBtn);

        // refresh opened aside concern status for UI update
        const vc = document.querySelector(
          ".concern-view-controls",
        ) as HTMLElement;
        const asideSelected = vc.querySelector(".selected") as HTMLElement;
        const asideOpenedStatus = asideSelected?.dataset
          .status as Concern["status"];
        await openAsideConcernStatus(asideOpenedStatus);
      } catch (err) {
        console.error(err);
        highlighSelectedStatusBtn(statusBtn, "revertUI");
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
export { initEvents, highlightStatusBtnsOnLoad, openAsideConcernStatus };

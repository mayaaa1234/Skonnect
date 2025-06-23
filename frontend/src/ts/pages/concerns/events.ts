//   document.querySelectorAll<HTMLDivElement>(".concern-status");
// import type { Concern } from "@ts/profile/concernsPage/api.ts";
import { notifyError, notifySuccess } from "../../utils/showNotif.ts";
import { showLoading, hideLoading } from "../../components/loadingSpinner.ts";
import { renderAsideList } from "../profile/concernsPage/UI.ts";

import {
  Concern,
  fetchAllConcerns,
  submitConcern,
} from "../profile/concernsPage/api.ts";
import { initTogleResponseBtnEvents } from "@ts-pages/profile/concernsPage/utils.ts";

const container = document.querySelector(
  ".concern-popup-body",
) as HTMLDivElement;

const popupOverlay = document.querySelector(
  ".concern-popup-overlay",
) as HTMLElement;

async function openPopupConcernStatus(status: Concern["status"]) {
  try {
    const concerns: Concern[] = await fetchAllConcerns();

    const viewStatusContainer = document.querySelector(
      ".concern-popup-view-status",
    ) as HTMLElement;
    if (!viewStatusContainer) {
      console.log("viewstatus not found.");
      return;
    }
    viewStatusContainer.innerHTML = "";

    viewStatusContainer.innerHTML = `
      ${renderAsideList(concerns, status, true)}
      `;
  } catch (error) {
    console.log(error);
  }
}

async function openAsideConcernStatus(status: Concern["status"]) {
  try {
    const concerns: Concern[] = await fetchAllConcerns();

    const viewStatusContainer = document.querySelector(
      ".concern-view-status",
    ) as HTMLElement;

    if (!viewStatusContainer) {
      console.log("viewstatus not found.");
      return;
    }
    viewStatusContainer.innerHTML = "";

    viewStatusContainer.innerHTML = `
      ${renderAsideList(concerns, status)}
      `;
  } catch (error) {
    console.log(error);
  }
}

const form = document.querySelector(".submit-concern-form") as HTMLFormElement;

const errDiv = document.querySelector(".error") as HTMLDivElement;
const submitBtn = form.querySelector("button") as HTMLButtonElement;
const message = document.querySelector(
  ".form-textarea-message",
) as HTMLTextAreaElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // const formData = new FormData(form);
  // const data = Object.fromEntries(formData.entries());
  const msg = message.value.trim();

  if (!msg) {
    errDiv.style.display = "block";
    errDiv.classList.add("ta-c");
    errDiv.textContent = "field can't be empty";
    return;
  } else {
    errDiv.style.display = "none";
  }

  console.log(msg);

  try {
    showLoading(submitBtn, "small");
    await submitConcern(msg);
    hideLoading();
    submitBtn.innerText = "Submit";
    notifySuccess(
      "Concern submitted successfully, please wait for admin response",
    );
    message.value = "";
  } catch (err) {
    submitBtn.innerText = "Submit";
    hideLoading();
    notifyError("Submit concern failed, please try again");
    console.error("Failed to submit concern:", err);
  }
});

const asideButtons = document.querySelectorAll<HTMLDivElement>(
  ".concerns-aside-box .concern-status",
);
asideButtons.forEach((btn) => {
  const status = btn.dataset.status as Concern["status"];
  btn.addEventListener("click", () => {
    asideButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    openAsideConcernStatus(status);
  });
});

// Viewing concern list on sm screens

const viewConcernsBtn = document.querySelector(
  ".view-popup-concerns-btn",
) as HTMLElement;
viewConcernsBtn.addEventListener("click", () => {
  popupOverlay.classList.remove("close");
  popupOverlay.classList.add("open");
  openPopupConcernStatus("rejected");
});

const closeBtn = document.querySelector(
  ".close-concern-popup-btn",
) as HTMLElement;
closeBtn.addEventListener("click", () => {
  popupOverlay.classList.add("close");
});

const popupButtons = document.querySelectorAll<HTMLDivElement>(
  ".concern-popup-overlay .concern-status",
);

popupButtons.forEach((btn) => {
  const status = btn.dataset.status as Concern["status"];
  btn.addEventListener("click", () => {
    popupButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    openPopupConcernStatus(status);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  initTogleResponseBtnEvents();
  openAsideConcernStatus("rejected");
});

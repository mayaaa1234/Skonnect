import initProfilePage from "../profileData/initProfile.ts";
import initProjectsAndEventsPage from "../projectsAndEvents/initProjectsAndEvents.ts";
import initBudgetAllocationPage from "../budgetAllocation/initBudgetAllocation.ts";
import initUsersPage from "../users/initUsers.ts";

import {
  Slideshow,
  fetchAllSlideShows,
} from "../../home/slideShow/fetchSlides.ts";

const dataPage = document.documentElement.dataset.page;
const dom = document.documentElement;

document.addEventListener("DOMContentLoaded", () => {
  const action = getSelectedActionOrDefault();
  highlightButton(action);
  openSelectedData(action);
});

const container = document.getElementById("data-container") as HTMLElement;
const sidebarUlbtns = document.querySelectorAll(
  ".sidebar-ul button",
) as NodeListOf<HTMLButtonElement>;

const DEFAULT_ACTION = "profile";
const SELECTED_KEY = "selectedSidebarBtn";

function getSelectedActionOrDefault(): string {
  // return localStorage.getItem(SELECTED_KEY) ?? DEFAULT_ACTION;
  return sessionStorage.getItem(SELECTED_KEY) ?? DEFAULT_ACTION;
}

function highlightButton(action: string) {
  sidebarUlbtns.forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.action === action);
  });
}

async function openSelectedData(action: string): Promise<void> {
  switch (action) {
    case "profile":
      await initProfilePage();
      break;
    case "users":
      await initUsersPage();
      break;
    case "projectsAndEvents":
      await initProjectsAndEventsPage();
      break;
    case "budgetAllocation":
      await initBudgetAllocationPage();
      break;
    case "concerns":
      await initConcernsPage();
      break;
    default:
      console.warn(`Unhandled action: ${action}`);
  }
}

sidebarUlbtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    container.innerHTML = "";

    console.log("click");

    const action = btn.dataset.action!;
    // localStorage.setItem(SELECTED_KEY, action);
    sessionStorage.setItem(SELECTED_KEY, action);

    highlightButton(action);
    openSelectedData(action);
  });
});

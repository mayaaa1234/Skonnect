import initProfilePage from "../profileData/initProfile.ts";
import initUsersPage from "../users/initUsers.ts";
import initProjectsAndEventsPage from "../projectsAndEvents/initProjectsAndEvents.ts";
import initBudgetAllocationPage from "../budgetAllocation/initBudgetAllocation.ts";
import initConcernsPage from "../concernsPage/initConcernsPage.ts";
import initCouncilsPage from "../councilsPage/initCouncilsPage.ts";

import {
  showLoading,
  hideLoading,
} from "../../../components/loadingSpinner.ts";

// Define all valid page keys in one place
type PageKey =
  | "profile"
  | "users"
  | "projectsAndEvents"
  | "budgetAllocation"
  | "concerns"
  | "council";

// Storage key and default page
const STORAGE_KEY = "selectedSidebarBtn";
const DEFAULT_PAGE: PageKey = "profile";

// Map page keys to their initializer functions
const pageInitHandlers: Record<PageKey, () => Promise<void>> = {
  profile: initProfilePage,
  users: initUsersPage,
  projectsAndEvents: initProjectsAndEventsPage,
  budgetAllocation: initBudgetAllocationPage,
  concerns: initConcernsPage,
  council: initCouncilsPage,
};

const container = document.getElementById("data-container") as HTMLElement;
const sidebarButtons =
  document.querySelectorAll<HTMLButtonElement>(".sidebar-ul button");

document.addEventListener("DOMContentLoaded", () => {
  const initialPage = getSelectedPage();
  selectPage(initialPage);
});

// Helpers for sessionStorage
function getSelectedPage(): PageKey {
  const stored = sessionStorage.getItem(STORAGE_KEY) as PageKey | null;
  return stored && stored in pageInitHandlers ? stored : DEFAULT_PAGE;
}

function setSelectedPage(page: PageKey): void {
  sessionStorage.setItem(STORAGE_KEY, page);
}

// Core Flow
async function selectPage(page: PageKey): Promise<void> {
  clearContainer();
  highlightButton(page);
  setSelectedPage(page);
  showLoading(container);

  try {
    await pageInitHandlers[page]();
    hideLoading();
  } catch (error) {
    showError(error);
  } finally {
    hideLoading();
  }
}

function clearContainer(): void {
  container.innerHTML = "";
}

function highlightButton(page: PageKey): void {
  sidebarButtons.forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.action === page);
  });
}

// // NOTE: put these two in utils later
// function showLoading(): void {
//   container.innerHTML = "";
//
//   const loader = document.createElement("div");
//   loader.id = "loading-indicator";
//   loader.className = "spinner";
//
//   container.appendChild(loader);
// }
//
// function hideLoading(): void {
//   const loader = document.getElementById("loading-indicator");
//   if (loader) loader.remove();
// }

function showError(error: any): void {
  const errEl = document.createElement("div");
  errEl.id = "error-indicator";
  errEl.textContent = "Failed to load content.";
  errEl.className = "error pt-3 mt-5 ta-c";
  container.appendChild(errEl);
  console.error(error);
}

// Bind click events once, ignoring duplicate clicks
sidebarButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action as PageKey;
    if (getSelectedPage() === action) return;
    selectPage(action);
  });
});

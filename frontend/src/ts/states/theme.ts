import { saveState, getState } from "../utils/saveState.ts";
const themeBtn = document.querySelector(".theme-btn") as HTMLElement;

// sets initial color scheme
const theme = (getState("theme") as string) || "dark";
document.documentElement.setAttribute("data-theme", theme);
themeBtn?.classList.add(theme); // which toggle icon to show

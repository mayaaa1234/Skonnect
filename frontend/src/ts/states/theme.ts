import { setState, getState } from "../utils/setGetState.ts";
const themeBtn = document.querySelector(".theme-btn") as HTMLElement;

// sets initial color scheme
//const theme = (getState("theme") as string) || "dark";
//document.documentElement.setAttribute("data-theme", theme);
//themeBtn?.classList.add(theme); // which toggle icon to show

const savedTheme = getState("theme");
const theme =
  savedTheme && (savedTheme === "light" || savedTheme === "dark")
    ? savedTheme
    : "dark";
document.documentElement.setAttribute("data-theme", theme);
setState("theme", theme);

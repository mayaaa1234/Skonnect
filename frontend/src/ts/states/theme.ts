import { setState, getState } from "../utils/setGetState.ts";

//const theme = (getState("theme") as string) || "dark";
//document.documentElement.setAttribute("data-theme", theme);

//on load get the color saved scheme if nothing then set a default one
document.addEventListener("DOMContentLoaded", () => {
  const theme = (getState("theme") as string) || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  setState("theme", theme);

  //console.log("theme", theme);

  const themeBtn = document.querySelector(".theme-btn") as HTMLElement;
  themeBtn?.classList.add(theme); // which toggle icon to show
});

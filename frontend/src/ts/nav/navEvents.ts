import { saveState, getState } from "../utils/saveState.ts";

const openBtn = document.querySelector(".nav-menu-btn-open") as HTMLElement;
const closeBtn = document.querySelector(".nav-menu-btn-close") as HTMLElement;
const popup = document.querySelector(".nav-menu-popup") as HTMLElement;
const content = document.querySelector(".menu-content") as HTMLElement;

// Toggle menu popup (on small screens)

const menuToggle = () => {
  openBtn.classList.toggle("clicked");
  popup.classList.toggle("open");
  content.classList.toggle("animate");
};
openBtn.addEventListener("click", () => menuToggle());
closeBtn.addEventListener("click", () => menuToggle());

const themeBtn = document.querySelector(".theme-btn") as HTMLElement;
const sun = document.querySelector(".sun") as HTMLElement;
const moon = document.querySelector(".moon") as HTMLElement;

// Theme events

// sets initial color scheme
const theme = (getState("theme") as string) || "dark";
document.documentElement.setAttribute("data-theme", theme);
themeBtn.classList.add(theme);

// toggle color scheme and icons
themeBtn?.addEventListener("click", () => {
  const currentTheme: string =
    document.documentElement.getAttribute("data-theme")!;

  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);

  themeBtn.classList.remove("dark", "light");
  themeBtn.classList.add(newTheme);

  saveState("theme", newTheme);
});

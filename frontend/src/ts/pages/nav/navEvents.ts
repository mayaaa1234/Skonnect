import { setState } from "../../utils/setGetState.ts";

const openBtn = document.querySelector(".nav-menu-btn-open") as HTMLElement;
const closeBtn = document.querySelector(".nav-menu-btn-close") as HTMLElement;
const popup = document.querySelector(".nav-menu-popup") as HTMLElement;
const content = document.querySelector(".menu-content") as HTMLElement;

// toggle menu popup (on small screens)
const menuToggle = () => {
  openBtn?.classList.toggle("clicked");
  popup?.classList.toggle("open");
  content?.classList.toggle("animate");
};
openBtn?.addEventListener("click", () => menuToggle());
closeBtn?.addEventListener("click", () => menuToggle());

const themeBtn = document.querySelector(".theme-btn") as HTMLElement;
const sun = document.querySelector(".sun") as HTMLElement;
const moon = document.querySelector(".moon") as HTMLElement;

// toggle color scheme and icons
themeBtn?.addEventListener("click", () => {
  console.log("click");

  const currentTheme: string =
    document.documentElement.getAttribute("data-theme") || "dark";

  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);

  themeBtn.classList.remove("dark", "light");
  themeBtn.classList.add(newTheme);

  setState("theme", newTheme);
});

// nav services dropdown
const dropdown = document.querySelector(
  ".nav-link-dropdown",
) as HTMLSelectElement;

if (dropdown) {
  dropdown.addEventListener("change", () => {
    const selectedValue: string = dropdown.value;
    if (selectedValue === "/submit-suggestions") {
      window.open("https://forms.gle/H9YozQFgCx9CWN6d8", "_blank");
      //window.location.href = "https://forms.gle/H9YozQFgCx9CWN6d8";
      return;
    }

    if (selectedValue) {
      console.log("val", selectedValue);
      window.location.href = selectedValue; // Redirects to the selected page
    }
  });
  // Reset the dropdown to the default option after a short delay
  setTimeout(() => {
    dropdown.value = "";
  }, 0);
}

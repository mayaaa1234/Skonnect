const showSidebarBtn = document.querySelector(
  ".profile-btn-show-sidebar",
)
const hideSidebarBtn = document.querySelector(
  ".sidebar-btn-hide-sidebar",
) as HTMLElement;
const sidebar = document.getElementById("sidebar");
const dataPage = document.documentElement.dataset.page;
const dom = document.documentElement;

// TOGGLING SIDEBAR

if (dataPage === "profile" && sessionStorage.getItem("active-sidebar")) {
  dom.classList.toggle("active-sidebar", true);
}

showSidebarBtn!.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage === "profile") {
    dom.classList.add("active-sidebar");
    sessionStorage.setItem("active-sidebar", "true");
  }
});

hideSidebarBtn?.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.remove("active-sidebar");
    sessionStorage.removeItem("active-sidebar");
  }
});

// Clear active sidebar on page change
export const clearActiveSidebar = () => {
  const currentDataPage = document.documentElement.dataset.page;

  if (currentDataPage !== "profile") {
    sessionStorage.removeItem("active-sidebar");
  }
};

// document.addEventListener("click", (e) => {
//   if (!sidebar || !showSidebarBtn) return;
//
//   const t = e.target as Node;
//
//   if (
//     dom.classList.contains("active-sidebar") &&
//     !sidebar.contains(t) &&
//     // excluding the btn itself from triggering the close
//     !showSidebarBtn.contains(t)
//   )
//     dom.classList.remove("active-sidebar");
// });

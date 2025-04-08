document.addEventListener("DOMContentLoaded", () => {
  if (document.documentElement.dataset.page !== "profile") {
    sessionStorage.removeItem("active-sidebar");
    sessionStorage.removeItem("selectedSidebarBtn");
  }
});

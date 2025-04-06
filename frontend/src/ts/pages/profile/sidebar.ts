const btn = document.querySelector(".profile-btn-show-sidebar");
const sidebar = document.getElementById("sidebar");
const dataPage = document.documentElement.dataset.page;
const dom = document.documentElement;

btn?.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.toggle("active-sidebar");
  }
});

document.addEventListener("click", (e) => {
  if (!sidebar || !btn) return;

  const t = e.target as Node;

  if (
    dom.classList.contains("active-sidebar") &&
    !sidebar.contains(t) &&
    // excluding the btn itself from triggering the close
    !btn.contains(t)
  ) {
    dom.classList.remove("active-sidebar");
  }
});

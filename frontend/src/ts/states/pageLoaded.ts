// undo skeleton layout after page load
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".nav-menu-btn-open") as HTMLElement;
  const closeBtn = document.querySelector(".nav-menu-btn-close") as HTMLElement;
  const popup = document.querySelector(".nav-menu-popup") as HTMLElement;
  const content = document.querySelector(".menu-content") as HTMLElement;

  const toggle = () => {
    openBtn.classList.toggle("clicked");
    popup.classList.toggle("open");
    content.classList.toggle("animate");
  };
  openBtn.addEventListener("click", () => toggle());
  closeBtn.addEventListener("click", () => toggle());
});

const overlay = document.getElementById("upload-popup-overlay")!;
const openBtn = document.getElementById("upload-trigger-btn")!;
const dropZone = document.getElementById("drop-zone") as HTMLElement;
const nav = document.querySelector("nav")!;

openBtn?.addEventListener("click", () => {
  overlay?.classList.add("show");
});

document.addEventListener("click", (e) => {
  if (overlay?.matches(".show")) {
    if (e.target === overlay || e.target === nav) {
      overlay?.classList.remove("show");
    }
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone?.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone?.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");
  });
});

// const statusButtons =
//   document.querySelectorAll<HTMLDivElement>(".concern-status");
const container = document.querySelector(
  ".concern-popup-body",
) as HTMLDivElement;
const popupOverlay = document.querySelector(
  ".concern-popup-overlay",
) as HTMLElement;
const viewConcernsBtn = document.querySelector(".view-concerns") as HTMLElement;
const closeBtn = document.querySelector(
  ".close-concern-popup-btn",
) as HTMLElement;

const popupButtons = document.querySelectorAll<HTMLDivElement>(
  ".concern-popup-overlay .concern-status",
);
const asideButtons = document.querySelectorAll<HTMLDivElement>(
  ".concerns-aside-box .concern-status",
);

popupButtons.forEach((btn) => {
  const status = btn.dataset.status;
  btn.addEventListener("click", () => {
    popupButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    switch (status) {
      case "pending":
        openPending();
        break;
      case "inProgress":
        openInProgress();
        break;
      case "resolved":
        openResolved();
        break;
    }
  });
});

asideButtons.forEach((btn) => {
  const status = btn.dataset.status;
  btn.addEventListener("click", () => {
    asideButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    switch (status) {
      case "pending":
        openPending();
        break;
      case "inProgress":
        openInProgress();
        break;
      case "resolved":
        openResolved();
        break;
    }
  });
});

viewConcernsBtn.addEventListener("click", () => {
  popupOverlay.classList.remove("close");
  popupOverlay.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  popupOverlay.classList.add("close");
});

function openPending() {
  console.log("hello");
}

function openInProgress() {
  console.log("hello");
}

function openResolved() {
  console.log("hello");
}

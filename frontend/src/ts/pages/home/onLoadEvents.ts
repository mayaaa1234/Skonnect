import { notifyGradient } from "../../utils/showNotif.ts";
// import { manualResizeTrigger } from "./slideShow/slidesDOM.ts";

const manualResizeTrigger = true; // WARN: temporary to flail err

// notif message
const signupMsg = sessionStorage.getItem("signupSuccessNotif");

const loginMsg = sessionStorage.getItem("loginWelcomeNotif");
if (signupMsg) {
  notifyGradient(signupMsg);
  sessionStorage.removeItem("signupSuccessNotif");
} else if (loginMsg) {
  notifyGradient(loginMsg);
  sessionStorage.removeItem("loginWelcomeNotif");
}

// scroll animation
const observer = new IntersectionObserver(
  (entries, _obs) => {
    entries.forEach((entry) => {
      // dont trigger animation if slideShow event is hit
      // console.log("resize trigger: ", manualResizeTrigger);
      if (manualResizeTrigger) {
        // removing the hidden class effectively
        // removing it too from observed elem
        const target = entry.target as HTMLElement;
        //target.style.transition = "none";
        //target.style.transform = "translateY(0)";
        target.classList.remove("hidden");
        //void target.offsetHeight;
        //entry.target.style.transition = "none"
        //entry.target.classList.remove("hidden");
        //entry.target.classList.add("show");
        return;
      }

      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        // this doesnt work so i guess the workarond for now (immport var state)
        //_obs.unobserve(entry.target); // Stop observing once shown
      }
    });
  },
  { threshold: 0.2 },
);

// Observe elements
document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

// Card Links
document.addEventListener("DOMContentLoaded", async () => {
  const annual = document.querySelector(".annual") as HTMLElement;
  const concern = document.querySelector(".concern") as HTMLElement;
  const council = document.querySelector(".council") as HTMLElement;
  const events = document.querySelector(".events") as HTMLElement;

  annual.onclick = () => (location.href = "/annual-budget-allocation");
  concern.onclick = () => (location.href = "/concerns-or-suggestions");
  council.onclick = () => (location.href = "/council-information");
  events.onclick = () => (location.href = "/projects-and-events");
});

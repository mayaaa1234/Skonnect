const thresholdPx = 1536;
let slideIndex = 1;

function showSlides(n: number): void {
  const lgContainer = document.querySelector<HTMLElement>(
    ".council-slideshow-container-lg-screens",
  );
  // // INFO: '!!' converts result into bool
  const isLargeScreen = !!(lgContainer && lgContainer.offsetParent);
  // const isLargeScreen = window.innerWidth >= thresholdPx;
  console.log("islg", isLargeScreen);

  const slides = document.getElementsByClassName(
    isLargeScreen ? "slides-lg" : "slides-sm",
  ) as HTMLCollectionOf<HTMLElement>;

  const dots = document.getElementsByClassName(
    isLargeScreen ? "dot-lg" : "dot-sm",
  ) as HTMLCollectionOf<HTMLElement>;

  if (slides.length === 0 || dots.length === 0) return;

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = isLargeScreen ? "flex" : "block";
  dots[slideIndex - 1].className += " active";
}

function plusSlides(n: number): void {
  slideIndex += n;
  showSlides(slideIndex);
}

function currentSlide(n: number): void {
  slideIndex = n;
  showSlides(slideIndex);
}

function setupSlideshowControls(): void {
  document
    .querySelectorAll<HTMLElement>('[data-slide-control="prev"]')
    .forEach((el) => {
      el.addEventListener("click", () => plusSlides(-1));
    });

  document
    .querySelectorAll<HTMLElement>('[data-slide-control="next"]')
    .forEach((el) => {
      el.addEventListener("click", () => plusSlides(1));
    });

  document.querySelectorAll<HTMLElement>("[data-dot]").forEach((el) => {
    el.addEventListener("click", () => {
      console.log("dot clicked");
      const index = parseInt(el.getAttribute("data-dot") || "1", 10);
      currentSlide(index);
    });
  });
}

let lastWindowWidth = window.innerWidth;
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;

  const crossedThreshold =
    (lastWindowWidth < thresholdPx && newWidth >= thresholdPx) ||
    (lastWindowWidth >= thresholdPx && newWidth < thresholdPx);

  if (crossedThreshold) {
    setupSlideshowControls();
    showSlides(slideIndex);
    console.log("threshold hit");
  }

  lastWindowWidth = newWidth;
});

export default function initSlideshow() {
  setupSlideshowControls();
  showSlides(slideIndex);
}

import { Slideshow, fetchAllSlideShows } from "./fetchSlides.ts";

export default async function initSlideIndexesAndEvents(): Promise<void> {
  // Track the current slide (1-based) for each slideshow
  const slideIndexes: Record<number, number> = {};

  // Initialize slides for each slideshow after DOM loads.
  async function initializeSlides(): Promise<void> {
    try {
      const slideshows: Slideshow[] = await fetchAllSlideShows();
      if (!slideshows.length) {
        return;
      }
      slideshows.forEach((s) => {
        // Set the initial slide index
        slideIndexes[s.id] = 1;
        showSlides(s.id, 1);
      });
      console.log({ slideIndexes });
    } catch (error) {
      console.error("Error in initializeSlides:", error);
    }
  }
  initializeSlides();

  // Change slide by an increment (positive for next, negative for prev)
  function plusSlides(slideshowId: number, n: number): void {
    const current = slideIndexes[slideshowId] || 1;
    showSlides(slideshowId, current + n);
  }

  // Show the specific slide for a given slideshow.
  function showSlides(slideshowId: number, n: number): void {
    const slideshow = document.querySelector(
      `.slideshow[data-slideshow-id="${slideshowId}"]`,
    );
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll<HTMLElement>(".slides");
    const dots = slideshow.querySelectorAll<HTMLElement>(".dot");
    const totalSlides = slides.length;

    // Wrap around if n is out of bounds.
    if (n > totalSlides) n = 1;
    if (n < 1) n = totalSlides;
    slideIndexes[slideshowId] = n;

    slides.forEach((slide, index) => {
      slide.style.display =
        index === slideIndexes[slideshowId] - 1 ? "block" : "none";
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === slideIndexes[slideshowId] - 1);
    });
  }

  // Event Delegation
  document.querySelector(".events")?.addEventListener("click", (e) => {
    const target = e.target as Element;

    // Next button click
    if (target.matches(".next")) {
      const slideshowIdAttr = target.getAttribute("data-slideshow-id");
      if (slideshowIdAttr) {
        const slideshowId = Number(slideshowIdAttr);
        plusSlides(slideshowId, 1);
      }
    }

    // Previous button click
    if (target.matches(".prev")) {
      const slideshowIdAttr = target.getAttribute("data-slideshow-id");
      if (slideshowIdAttr) {
        const slideshowId = Number(slideshowIdAttr);
        plusSlides(slideshowId, -1);
      }
    }

    // Dot navigation click
    if (target.matches(".dot")) {
      const slideshowIdAttr = target.getAttribute("data-slideshow-id");
      const dotIndexAttr = target.getAttribute("data-dot-index");
      if (slideshowIdAttr && dotIndexAttr) {
        const slideshowId = Number(slideshowIdAttr);
        const dotIndex = Number(dotIndexAttr);

        showSlides(slideshowId, dotIndex);
      }
    }
  });
}

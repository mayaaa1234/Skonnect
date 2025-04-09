document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".infinite-carousel") as HTMLElement;
  const track = carousel.querySelector(".carousel-track")!;
  if (!carousel || !track) return;

  // 1) duplicate content for seamless loop
  track.innerHTML += track.innerHTML;

  // 2) calculate scroll parameters (now let)
  const duration = 18_000; // ms per full pass
  let fullWidth = track.scrollWidth / 2;
  let speed = fullWidth / duration; // px per ms

  // helper to recalc on resize
  function updateDimensions() {
    fullWidth = track.scrollWidth / 2;
    speed = fullWidth / duration;
    // keep scrollLeft within the new range
    carousel.scrollLeft %= fullWidth;
  }

  // 3) recalc whenever the viewport changes
  window.addEventListener("resize", updateDimensions);
  window.addEventListener("orientationchange", updateDimensions);

  let lastTime = performance.now();
  let paused = false;
  carousel.scrollLeft = 0;

  // 4) pause/resume on hover & touch
  carousel.addEventListener("mouseenter", () => {
    paused = true;
  });
  carousel.addEventListener("mouseleave", () => {
    paused = false;
    lastTime = performance.now();
  });
  carousel.addEventListener("touchstart", () => {
    paused = true;
  });
  carousel.addEventListener("touchend", () => {
    paused = false;
    lastTime = performance.now();
  });

  // 5) the animation loop
  function step(now: DOMHighResTimeStamp) {
    if (!paused) {
      const delta = now - lastTime;
      carousel.scrollLeft += speed * delta;

      // wrap‑around
      if (carousel.scrollLeft >= fullWidth) {
        carousel.scrollLeft -= fullWidth;
      }
    }
    lastTime = now;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
});

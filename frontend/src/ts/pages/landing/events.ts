// scroll animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 },
); // Trigger when 20% of the element is visible

document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

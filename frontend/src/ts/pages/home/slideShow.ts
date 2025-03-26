export let manualResizeTrigger = false;
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.setAttribute("loading", "lazy");
  });

  //export let manualResizeTrigger = false;
  let slideIndex = 1;

  showSlides(slideIndex);

  // Next/previous controls
  function plusSlides(n: number) {
    manualResizeTrigger = true;
    showSlides((slideIndex += n));
  }

  // Thumbnail image controls
  function currentSlide(n: number) {
    manualResizeTrigger = true;
    showSlides((slideIndex = n));
  }

  function showSlides(n: number) {
    //console.log("slides work");

    let i: number;
    const slides = document.getElementsByClassName(
      "mySlides",
    ) as HTMLCollectionOf<HTMLElement>;
    const dots = document.getElementsByClassName(
      "dot",
    ) as HTMLCollectionOf<HTMLElement>;

    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  }

  const next = document.querySelector(".next") as HTMLElement;
  const prev = document.querySelector(".prev") as HTMLElement;

  prev.onclick = () => plusSlides(-1);
  next.onclick = () => plusSlides(1);

  // for when clicking the dots
  const dots = document.getElementsByClassName(
    "dot",
  ) as HTMLCollectionOf<HTMLElement>;

  for (let i = 0; i < dots.length; i++) {
    dots[i].onclick = () => currentSlide(i + 1);
  }

  // the number text in top left of pictures
  const numberText = document.getElementsByClassName(
    "numbertext",
  ) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < numberText.length; i++) {
    numberText[i].innerText = `${i + 1} / ${numberText.length}`;
    console.log(numberText[i].innerText);
  }
});
//AUTOMATIC
//let slideIndex = 0;
//showSlides();
//
//function showSlides() {
//  let i;
//  let slides = document.getElementsByClassName("mySlides");
//  for (i = 0; i < slides.length; i++) {
//    slides[i].style.display = "none";
//  }
//  slideIndex++;
//  if (slideIndex > slides.length) {slideIndex = 1}
//  slides[slideIndex-1].style.display = "block";
//  setTimeout(showSlides, 2000); // Change image every 2 seconds
//}
//});

//MULTIPLE SLIDESHOW
//let slideIndex = [1, 1];
///* Class the members of each slideshow group with different CSS classes */
//const slideId = ["slides1", "slides2"];
//showSlides(1, 0);
//showSlides(1, 1);
//
//function plusSlides(n, no) {
//  showSlides((slideIndex[no] += n), no);
//}
//
//function showSlides(n, no) {
//  let i;
//  let x = document.getElementsByClassName(slideId[no]);
//  if (n > x.length) {
//    slideIndex[no] = 1;
//  }
//  if (n < 1) {
//    slideIndex[no] = x.length;
//  }
//  for (i = 0; i < x.length; i++) {
//    x[i].style.display = "none";
//  }
//  x[slideIndex[no] - 1].style.display = "block";
//}
////CODE FOR MULTIPLE:
//export let manualResizeTrigger = false;
//
//document.addEventListener("DOMContentLoaded", () => {
//  // MULTIPLE SLIDESHOW SETUP
//  // Define an array to store the current slide index for each slideshow group.
//  const slideIndices: number[] = [1, 1];
//
//  // all the slide containers
//  const slideIds: string[] = ["mySlides1", "mySlides2"];
//
//  // Initialize each slideshow group.
//  slideIndices.forEach((_, no) => {
//    showSlides(slideIndices[no], no);
//  });
//  // Next/previous controls for a given slideshow group.
//  // (Adjust this if you have separate buttons for each slideshow.)
//  function plusSlides(n: number, no: number) {
//    manualResizeTrigger = true;
//    slideIndices[no] += n;
//    showSlides(slideIndices[no], no);
//  }
//
//  // Set the current slide in a group.
//  function currentSlide(n: number, no: number) {
//    manualResizeTrigger = true;
//    slideIndices[no] = n;
//    showSlides(slideIndices[no], no);
//  }
//
//  // This function displays the appropriate slide for the given group.
//  function showSlides(n: number, no: number) {
//    let i: number;
//    // Get all slides in the current group.
//    const slides = document.getElementsByClassName(
//      slideIds[no],
//    ) as HTMLCollectionOf<HTMLElement>;
//
//    // Wrap the slide index if out-of-bounds.
//    if (n > slides.length) {
//      slideIndices[no] = 1;
//    }
//    if (n < 1) {
//      slideIndices[no] = slides.length;
//    }
//
//    // Hide all slides in the group.
//    for (i = 0; i < slides.length; i++) {
//      slides[i].style.display = "none";
//    }
//
//    // Display the current slide.
//    slides[slideIndices[no] - 1].style.display = "block";
//  }
//
//  // Example of binding controls if you have separate controls for each slideshow:
//  // (Assumes you have elements with data attributes or IDs to target each group.)
//  const nextButtons = document.querySelectorAll(".next");
//  const prevButtons = document.querySelectorAll(".prev");
//
//  // For simplicity, we assume the first set of buttons control the first slideshow group,
//  // and the second set (if present) control the second slideshow group.
//  if (nextButtons.length >= 1 && prevButtons.length >= 1) {
//    // Bind controls for slideshow group 0.
//    prevButtons[0].addEventListener("click", () => plusSlides(-1, 0));
//    nextButtons[0].addEventListener("click", () => plusSlides(1, 0));
//  }
//  if (nextButtons.length >= 2 && prevButtons.length >= 2) {
//    // Bind controls for slideshow group 1.
//    prevButtons[1].addEventListener("click", () => plusSlides(-1, 1));
//    nextButtons[1].addEventListener("click", () => plusSlides(1, 1));
//  }
//
//  // For example, if each slideshow group has its own set of dots with a unique container
//  // (e.g. a container with an id like "dotGroup0" for group 0), then you can query and bind them:
//  const dotGroup0 = document.querySelectorAll(
//    "#dotGroup0 .dot",
//  ) as NodeListOf<HTMLElement>;
//  dotGroup0.forEach((dot, index) => {
//    dot.addEventListener("click", () => currentSlide(index + 1, 0));
//  });
//
//  const dotGroup1 = document.querySelectorAll(
//    "#dotGroup1 .dot",
//  ) as NodeListOf<HTMLElement>;
//  dotGroup1.forEach((dot, index) => {
//    dot.addEventListener("click", () => currentSlide(index + 1, 1));
//  });
//});

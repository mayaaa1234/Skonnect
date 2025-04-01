// export let manualResizeTrigger = false;

// current slide index for each slideshow group.
const slideIndices: number[] = [1, 1, 1, 1, 1];

const slideIds: string[] = ["mySlides1", "mySlides2"];

const plusSlide = (n: number, no: number) => {
  showSlides(n, no);
};

const currentSlide = (n: number, no: number) => {
  showSlides(n, no);
};

slideIds.forEach((id) => {
  showSlides(slideIndices[no], no);
});

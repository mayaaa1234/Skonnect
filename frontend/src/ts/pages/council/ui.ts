import { notifyError } from "@utils/showNotif.ts";
import { fetchAllImageURLs } from "../../pages/profile/councilsPage/data.ts";

const main = document.querySelector("main.council") as HTMLElement;
const lgScreenContainer = document.querySelector(
  ".council-slideshow-container-lg-screens",
) as HTMLElement;
const smScreenContainer = document.querySelector(
  ".council-slideshow-container-sm-screens",
) as HTMLElement;

const lgScreenChunkSize = 3;

// Create slideshow controls (prev/next + dots)
function createSlideshowControls(
  numDots: number,
  size: "sm" | "lg",
): HTMLElement {
  const container = document.createElement("div");

  const prev = document.createElement("a");
  prev.className = "prev";
  prev.setAttribute("data-slide-control", "prev");
  prev.innerHTML = "&#10094;";

  const next = document.createElement("a");
  next.className = "next";
  next.setAttribute("data-slide-control", "next");
  next.innerHTML = "&#10095;";

  const dotsWrapper = document.createElement("div");
  dotsWrapper.style.textAlign = "center";

  for (let i = 1; i <= numDots; i++) {
    const dot = document.createElement("span");
    dot.className = `dot dot-${size}`;
    dot.setAttribute("data-dot", String(i));
    dotsWrapper.appendChild(dot);
  }

  container.appendChild(prev);
  container.appendChild(next);
  container.appendChild(dotsWrapper);

  return container;
}

// Append slideshow controls to the container
function appendControls(
  container: HTMLElement,
  count: number,
  size: "sm" | "lg",
): void {
  const controls = createSlideshowControls(count, size);
  container.appendChild(controls);
}

export default async function renderSlides(): Promise<void> {
  const imageRef = await fetchAllImageURLs();
  console.log({ imageRef });

  if (imageRef.length === 0) {
    main.innerHTML = "<h4 class='muted-2'>Empty council images...</h4>";
    return;
  }

  lgScreenContainer.innerHTML = "";
  smScreenContainer.innerHTML = "";

  // --- Large screen slides ---
  const lgSlidesCount = Math.ceil(imageRef.length / lgScreenChunkSize);
  for (let i = 0; i < imageRef.length; i += lgScreenChunkSize) {
    const slide = document.createElement("div");
    slide.className = "gp-30 ai-c jc-c slides-lg fade";

    imageRef.slice(i, i + lgScreenChunkSize).forEach(({ url }) => {
      const img = document.createElement("img");
      img.src = url;
      img.className = "h-350px";
      img.style.width = "100%";
      slide.appendChild(img);
    });

    lgScreenContainer.appendChild(slide);
  }
  appendControls(lgScreenContainer, lgSlidesCount, "lg");

  // --- Small screen slides ---
  const smSlideHTML = imageRef
    .map(
      ({ id, url }) => `
        <div 
          data-id="${id}"
          style="position: relative;"
          class="slides-sm fade">

          <img
            src="${url}"
            class="council-image border-subtle-effect br-5"
            loading="lazy"
            width="100%"
            height="350"
            style="object-fit: fill;"
            alt="Council image"
        />
      </div>`,
    )
    .join("");

  smScreenContainer.innerHTML = smSlideHTML;
  appendControls(smScreenContainer, imageRef.length, "sm");

  main.appendChild(smScreenContainer);
  main.appendChild(lgScreenContainer);
}

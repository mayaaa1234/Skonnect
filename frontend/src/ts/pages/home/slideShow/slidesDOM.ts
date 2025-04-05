import { Slideshow, fetchAllSlideShows } from "./fetchSlides.ts";
// import { html } from "lit-html";
const container = document.querySelector(".slideshow-container") as HTMLElement;

function initSlideSkeletons() {
  const t = document.createElement("template");
  t.innerHTML = `
  <div class="slideshow" style="overflow: hidden" data-slideshow-id="">
    <p class="caption"></p>
    <div class="slides-container skeleton" style="border-radius: 20px; height: 600px; width: 600px;"
      >
      <a class="prev" data-slideshow-id="">&#10094;</a>
      <a class="next" data-slideshow-id="">&#10095;</a>
    </div>
    <br />
    <div class="dots-container" style="text-align: center">
      <span class="dot" data-slideshow-id="" data-dot-index=""></span>
      <span class="dot" data-slideshow-id="" data-dot-index=""></span>
      <span class="dot" data-slideshow-id="" data-dot-index=""></span>
    </div>
  </div>
`;

  for (let i = 0; i < 3; i++) {
    container.appendChild(t.content.cloneNode(true));
  }
}

export default async function loadSlideshows(): Promise<void> {
  if (!container) {
    console.log("no container found");
    return;
  }

  initSlideSkeletons();

  try {
    const slideshows: Slideshow[] = await fetchAllSlideShows();
    if (!slideshows[0]) {
      container.innerHTML = `
      <div>Empty Slideshows...</div>
`;
    }

    const slidesDOM = slideshows
      .map((s) => {
        const imagesDOM = s.images
          .map((img, idx) => {
            return `
              <div
                class="slides fade"
                data-slide-id="${s.id}"
                data-slide-number="${idx + 1}"
                style="display: none;"
              >
                <div class="numbertext">${idx + 1} / ${s.images.length}</div>
                <img
                  src="${img.url}"
                  class="br-20"
                  style="height: 600px; width: 600px"
                />
                <div class="text">Caption Text</div>
              </div>
            `;
          })
          .join("");

        const dotsDOM = s.images
          .map((_, idx) => {
            return `<span class="dot" data-slideshow-id="${s.id}" data-dot-index="${idx + 1}"></span>`;
          })
          .join("");

        return `
          <div class="slideshow" data-slideshow-id="${s.id}">
              <p class="caption">${s.caption ? s.caption : ""}</p>
              <div class="slides-container" style="height: 600px; width: 600px;">
                  ${imagesDOM}
                  <a class="prev" data-slideshow-id="${s.id}">&#10094;</a>
                  <a class="next" data-slideshow-id="${s.id}">&#10095;</a>
              </div>
              <br />
              <div class="dots-container" style="text-align: center">
                ${dotsDOM}
              </div>
          </div>
        `;
      })
      .join("");

    console.log({ slidesDOM });

    // if (!slideshows.length) {
    //   const container = document.querySelector(".container.events")!;
    //   container.insertAdjacentHTML(
    //     "beforeend",
    //     `
    //       <h1>Empty...</h1>
    //       </br>
    //       </br>
    //     `,
    //   );
    // }
    container.innerHTML = slidesDOM;
  } catch (error) {
    console.error("Error in loadSlideshows:", error);
  }
}

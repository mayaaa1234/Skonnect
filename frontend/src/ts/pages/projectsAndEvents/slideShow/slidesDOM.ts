import { Slideshow, fetchAllSlideShows } from "./fetchSlides.ts";
import { html } from "lit-html";
const slideshowContainer = document.querySelector(
  ".slideshow-container",
) as HTMLElement;

function initSlideSkeletons() {
  const t = document.createElement("template");
  t.innerHTML = `
  <div class="slideshow" style="overflow: hidden" data-slideshow-id="">
    <p class="caption"></p>
    <div class="skeleton" style="border-radius: 5px; height: 600px; width: 600px;"
      >
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
    slideshowContainer.appendChild(t.content.cloneNode(true));
  }
}

export default async function loadSlideshows(): Promise<void> {
  if (!slideshowContainer) {
    console.log("no container found");
    return;
  }

  try {
    const slideshows: Slideshow[] = await fetchAllSlideShows();
    // if (!slideshows[0]) {
    //   container.innerHTML = `
    //   <div>Empty Slideshows...</div>
    //   `;
    // }

    // <div class="numbertext">${idx + 1} / ${s.images.length}</div>
    //
    //

    if (!slideshows.length) {
      console.log("empty");

      const container = document.querySelector(
        ".slideshow-container",
      ) as HTMLElement;
      container.insertAdjacentHTML(
        "beforeend",
        `
          <h2 class="mb-4 ta-c">Empty...</h2>
          </br>
          </br>
        `,
      );
      return;
    }

    initSlideSkeletons();

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
                <img
                  src="${img.url}"
                  class="br-default"
                  style="height: 550px; width: 475px"
                />
              </div>
            `;
          })
          .join("");

        const dotsDOM = s.images
          .map((_, idx) => {
            return `<span class="dot" data-slideshow-id="${s.id}" data-dot-index="${idx + 1}"></span>`;
          })
          .join("");

        //       const allImagesView = s.images
        //         .map(
        //           (img) => `
        //     <img
        //       src="${img.url}"
        //       class="br-default"
        //       style="height: 200px; width: 200px;"
        //     />
        // `,
        //         )
        //         .join("");

        return `
          <div class="slideshow" data-slideshow-id="${s.id}">
            <div class="slides-container" style="height: 575px; width: 475px;">
              ${imagesDOM}
              <a class="prev" data-slideshow-id="${s.id}">&#10094;</a>
              <a class="next" data-slideshow-id="${s.id}">&#10095;</a>
              <p 
style="max-width: 90%;"
class="ellipsis caption">${s.caption ? s.caption : ""}</p>
            </div>
            <div class="dots-container" style="text-align: center">
              ${dotsDOM}
            </div>
          </div>


        `;
      })
      .join("");

    // <div class="images-container">
    //   ${allImagesView}
    // </div>
    // console.log({ slidesDOM });

    // ----------------------------------------------

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

    slideshowContainer.innerHTML = slidesDOM;
  } catch (error) {
    console.error("Error in loadSlideshows:", error);
  }
}

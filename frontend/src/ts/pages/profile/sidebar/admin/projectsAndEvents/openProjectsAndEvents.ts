const container = document.getElementById("data-container") as HTMLElement;
import {
  Slideshow,
  fetchAllSlideShows,
} from "../../../../home/slideShow/fetchSlides.ts";

import initSlideIndexesAndEvents from "../../../../home/slideShow/slideEvents.ts";

export default async function openProjectsAndEventsData(): Promise<void> {
  // initSlideSkeletons();

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
                  style="height: 300px; width: 100%"
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

        return `
            <div class="slideshow" data-slideshow-id="${s.id}">
              <p class="caption">${s.caption ? s.caption : ""}</p>
              <div
                class="slides-container"
                style="height: 300px; width: 300px;"
              >
                ${imagesDOM}
                <a class="prev" data-slideshow-id="${s.id}">&#10094;</a>
                <a class="next" data-slideshow-id="${s.id}">&#10095;</a>
              </div>
              <br />
              <div class="dots-container" style="text-align: center">
                ${dotsDOM}
              </div>
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

    const slideshowsControls = document.createElement("div");
    slideshowsControls.classList.add(
      "slideshows-control-container",
      "border-subtle-effect",
    );

    const controlBtns = `
<div class="control-btn-container">
      <button class="p-1 br-15 btn-dark-accent edit-btn control-btn">Edit</button>
      <button class="p-1 br-15 btn-outlined-dark-accent upload-btn control-btn">Upload</button>
</div>`;

    const uploadPopup = `
      <div class="upload-popup-overlay" id="upload-popup-overlay">
        <div class="upload-popup">
          <div class="popup-header">
            <h2>Upload Images</h2>
            <p>
              NOTE: <br />
              supported files: png, jpg, jpeg, webp<br />
              recommended 6-8 images only for storage considerations
            </p>
            <!-- <button id="close-upload-popup">&times;</button> -->
          </div>

          <form id="upload-form">
            <div id="drop-zone">
              <p>Drop the file here or click to upload</p>
              <input
                type="file"
                id="image-upload"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                required
              />
              <div class="img-preview-container"></div>
            </div>
            <button type="submit">Upload</button>
          </form>
        </div>
      </div>
    `;
    slideshowsControls.innerHTML = controlBtns + uploadPopup;

    const slideshowContainer = document.createElement("div");
    slideshowContainer.classList.add(
      "slideshow-container",
      "border-subtle-effect",
    );
    slideshowContainer.innerHTML = slidesDOM; // insert the data from db

    const projectsAndEventsContiner = document.createElement("div");
    projectsAndEventsContiner.classList.add(
      "projects-and-events-container",
      "container",
    );
    projectsAndEventsContiner.appendChild(slideshowsControls);
    projectsAndEventsContiner.appendChild(slideshowContainer);

    container.appendChild(projectsAndEventsContiner);

    await initSlideIndexesAndEvents();
  } catch (error) {
    console.error("Error in loadSlideshows:", error);
  }
}

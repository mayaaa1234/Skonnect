const container = document.getElementById("data-container") as HTMLElement;
import { html } from "lit-html";
import {
  Slideshow,
  fetchAllSlideShows,
} from "../../home/slideShow/fetchSlides.ts";

import initSlideIndexesAndEvents from "../../home/slideShow/slideEvents.ts";
import uploadEventListener from "./upload.ts";

export default async function openProjectsAndEventsData(): Promise<void> {
  // initSlideSkeletons();

  try {
    const slideshows: Slideshow[] = await fetchAllSlideShows();
    // if (!slideshows[0]) {
    //   container.innerHTML = `
    //   <div>Empty Slideshows...</div>
    //   `;
    // }

    const slidesDOM = slideshows
      .map((s) => {
        const imagesDOM = s.images
          .map((img, idx) => {
            return `
              <div
                class="slides fade "
                data-slide-id="${s.id}"
                data-slide-number="${idx + 1}"
                style="display: none;"
              >
                <img
                  src="${img.url}"
                  class="br-5" 
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
            <div class="slideshow " data-slideshow-id="${s.id}">
              <div
                class="slides-container "
                style="height: 320px; width: 300px;"
              >
                ${imagesDOM}
                <a class="prev" data-slideshow-id="${s.id}">&#10094;</a>
                <a class="next" data-slideshow-id="${s.id}">&#10095;</a>
              <p style="font-size: 14px;" class="caption">${s.caption}</p>

              <button class="slideshow-del-btn btn">
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D16D6A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              </button>
              </div>

              <div class="dots-container" style="text-align: center">
                ${dotsDOM}
              </div>

            </div>
          </div>
        `;
      })
      .join("");

    const slideshowsControls = document.createElement("div");
    slideshowsControls.classList.add("slideshows-control-container");

    const controlBtns = `
    <div class="control-btn-container">
      <button
        id="btn-edit-slideshows"
        class="p-1 br-40 btn-dark-accent edit-btn control-btn"
      >
        Edit
      </button>
      <button
        id="btn-open-upload-popup"
        class="p-1 br-40 btn-outlined-dark-accent  control-btn"
      >
        Upload
      </button>
    </div>`;

    const uploadPopup = `
      <div class="upload-popup-overlay" id="upload-popup-overlay">
        <div class="upload-popup">
          <div class="popup-header">
            <h2 class="gradient-text">Upload Images</h2>
            <p class="upload-note muted">
              FOR THIS TO WORK: <br />
              supported files: png, jpg, jpeg, webp<br />
              max images: 8 (this is for storage considerations)
            </p>
            <!-- <button id="close-upload-popup">&times;</button> -->
          </div>

          <form id="upload-form">
            <div class="dp-f gp-10">
              <!-- <label for="caption" class="upload-caption-label as-fe"> Caption: </label> -->
              <input
                maxlength="50"
                class="upload-input-caption"
                name="caption"
                type="text"
                placeholder="Caption"
              />
            </div>

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
    slideshowsControls.innerHTML = controlBtns;

    const slideshowContainer = document.createElement("div");
    slideshowContainer.classList.add("slideshow-container");
    slideshowContainer.innerHTML = slidesDOM; // insert the data from db

    const projectsAndEventsContiner = document.createElement("div");
    projectsAndEventsContiner.classList.add(
      "projects-and-events-container",
      "container",
      "events",
    );

    document.body.insertAdjacentHTML("beforeend", uploadPopup);
    projectsAndEventsContiner.appendChild(slideshowsControls);
    projectsAndEventsContiner.appendChild(slideshowContainer);

    container.appendChild(projectsAndEventsContiner);

    await initSlideIndexesAndEvents();
    // uploadEventListener();
    if (!slideshows.length) {
      console.log("empty");

      const container = document.getElementById(
        "data-container",
      ) as HTMLElement;
      container.insertAdjacentHTML(
        "beforeend",
        `
          <h2 class="mt-3 ta-c">Empty...</h2>
          </br>
          </br>
        `,
      );
      return;
    }
  } catch (error) {
    console.error("Error in loadSlideshows:", error);
  }
}

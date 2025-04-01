import { fetchAllSlideShows } from "./fetchSlides.ts";

const loadSlideshows = async () => {
  try {
    const slideshows = await fetchAllSlideShows();
    if (slideshows.length === 0) throw new Error("slideshow data is empty.");
    const slidesDOM = slideshows.map((s) => {
      return `
        <div class="slideshow">
          <p class="hidden caption">${s.caption}</p>

          <div class="slides-container">
            <div class="slides fade">
              <div class="numbertext"></div>
              <img
                src="sk-data/clean-1.webp"
                class="br-20"
                style="height: 600px; width: 100%"
              />
              <div class="text">Caption Text</div>
            </div>

            <div class="slides fade">
              <div class="numbertext"></div>
              <img
                src="sk-data/clean-2.webp"
                class="br-20"
                style="height: 600px; width: 100%"
              />
              <div class="text">Caption Two</div>
            </div>

            <div class="slides fade">
              <div class="numbertext"></div>
              <img
                src="sk-data/clean-3.webp"
                class="br-20"
                style="height: 600px; width: 100%"
              />
              <div class="text">Caption Three</div>
            </div>

            <div class="slides fade">
              <div class="numbertext"></div>
              <img
                src="sk-data/clean-5.webp"
                class="br-20"
                style="height: 600px; width: 100%"
              />
              <div class="text">Caption Text</div>
            </div>

            <div class="slides fade">
              <div class="numbertext"></div>
              <img
                src="sk-data/clean-6.webp"
                class="br-20"
                style="height: 600px; width: 100%"
              />
              <div class="text">Caption Text</div>
            </div>

            <!-- Next and previous buttons -->
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
          </div>
          <br />
          <!-- The dots/circles -->
          <div style="text-align: center">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      `;
    });

    console.log(slideshows);
  } catch (error) {
    console.error("err: ", error);
  }
};

loadSlideshows();

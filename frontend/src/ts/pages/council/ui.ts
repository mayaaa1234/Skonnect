import { notifyError } from "@utils/showNotif.ts";
import { fetchAllImageURLs } from "../../pages/profile/councilsPage/data.ts";

const main = document.querySelector("main.council") as HTMLElement;

async function imageList(): Promise<string> {
  const imageRef = await fetchAllImageURLs();

  if (imageRef.length === 0) {
    return "<h4 class='muted-2'>Empty council images...</h4>";
  }

  return imageRef
    .map(
      (ref) => `
        <div 
          data-id="${ref.id}"
          style="position: relative;"
          class="council-image-item">

          <img
            src="${ref.url}"
            class="council-image border-subtle-effect br-5"
            loading="lazy"
            width="600"
            height="750"
            style="object-fit: fill;"
            alt="Council image"
        />
      </div>`,
    )
    .join("");
}

export default async function openCouncilPage(): Promise<void> {
  main.innerHTML = "";

  const councilPageContainer = document.createElement("div");
  councilPageContainer.className = "council-page-container";

  const imageListContainer = document.createElement("div");
  imageListContainer.className =
    "br-10 border-subtle-effect image-list-container";

  try {
    imageListContainer.innerHTML = (await imageList()) as string;

    councilPageContainer.appendChild(imageListContainer);

    main.appendChild(councilPageContainer);
  } catch (error) {
    console.error("Error loading council images:", error);
    notifyError("Failed to load council images.");
  }
}

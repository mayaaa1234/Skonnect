import { fetchAllImageURLs } from "../data.ts";

export default async function imageList(): Promise<string> {
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
          <button class='delete btn-no-hover' aria-label="Delete image">
            <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D16D6A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>

          <img
            src="${ref.url}"
            class="council-image border-subtle-effect br-5"
            loading="lazy"
            width="300"
            height="350"
            style="object-fit: fill;"
            alt="Council image"
        />
      </div>`,
    )
    .join("");
}

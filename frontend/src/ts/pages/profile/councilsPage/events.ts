// import { notifyError, notifyInfo } from "@utils/showNotif.ts";
// import { fetchAllImageURLs } from "./data.ts";
// import openCouncilPage from "./page.ts";
// import { showLoading } from "@components/loadingSpinner.ts";
//
// export default function initEvents() {
//   const overlay = document.getElementById("council-upload-popup-overlay")!;
//   const openPopup = document.getElementById("btn-open-upload-popup");
//   const editSlideshows = document.getElementById("btn-edit-slideshows");
//   const dropZone = document.getElementById("drop-zone-council") as HTMLElement;
//   const fileInput = document.getElementById(
//     "image-upload-council",
//   ) as HTMLInputElement;
//   const nav = document.querySelector("nav")!;
//   const previewContainer = document.querySelector(
//     ".img-preview-container",
//   ) as HTMLElement;
//
//   // TOGGLE, DRAG, AND DROP EVENTS
//
//   if (!openPopup) {
//     console.log("cant find openPopup.");
//     return;
//   }
//   openPopup.addEventListener("click", () => {
//     // clear prev vals
//     shownPreviews.clear();
//     fileInput.value = "";
//     previewContainer.innerHTML = "";
//
//     overlay?.classList.add("show");
//
//     const instructionText = dropZone?.querySelector(
//       "p:first-child",
//     ) as HTMLElement;
//     if (instructionText) {
//       instructionText.style.display = "block";
//     }
//   });
//
//   document.addEventListener("click", (e) => {
//     if (overlay?.matches(".show")) {
//       if (e.target === overlay || e.target === nav) {
//         overlay?.classList.remove("show");
//       }
//     }
//   });
//
//   ["dragenter", "dragover"].forEach((eventName) => {
//     dropZone?.addEventListener(eventName, (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       dropZone.classList.add("dragover");
//     });
//   });
//
//   ["dragleave", "drop"].forEach((eventName) => {
//     dropZone?.addEventListener(eventName, (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       dropZone.classList.remove("dragover");
//     });
//   });
//
//   // UPLOADING THE FILE FORM
//
//   const form = document.getElementById(
//     "council-upload-form",
//   ) as HTMLFormElement;
//
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//
//     shownPreviews.clear();
//
//     const files = fileInput.files;
//
//     if (!files || files.length === 0) {
//       alert("Please select a file.");
//       return;
//     }
//
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
//
//     const fileArray = Array.from(files);
//
//     for (const file of fileArray) {
//       if (!allowedTypes.includes(file.type)) {
//         alert("Unsupported file type.");
//         return;
//       }
//     }
//
//     // add in the caption and the images
//     const formData = new FormData();
//     const uniqueFiles = Array.from(
//       fileArray.reduce((map, file) => {
//         const key = `${file.name}-${file.size}`;
//         if (!map.has(key)) map.set(key, file);
//         return map;
//       }, new Map<string, File>()),
//     ).map(([_, file]) => file);
//
//     for (const file of uniqueFiles) {
//       formData.append("images", file);
//     }
//     // for (const file of fileArray) {
//     //   formData.append("images", file);
//     // }
//
//     for (const [k, v] of (formData as any).entries()) {
//       console.log(`${k}:`, v);
//     }
//
//     // show loading spinner
//     const uploadBtn = document.querySelector(
//       ".upload-btn",
//     ) as HTMLButtonElement;
//     if (!uploadBtn) return;
//     uploadBtn.disabled = true;
//     showLoading(uploadBtn, "small");
//
//     try {
//       const res = await fetch("api/v1/councils/upload", {
//         method: "POST",
//         body: formData,
//       });
//
//       if (!res.ok) {
//         notifyError("Something went wrong. please try again later.");
//         overlay?.classList.remove("show");
//         throw new Error("Upload failed.");
//       }
//
//       // Success??
//
//       // hide loading spinner
//       uploadBtn.disabled = true;
//       uploadBtn.innerText = "Upload";
//
//       overlay?.classList.remove("show");
//       notifyInfo("Upload success");
//
//       // clear input vals
//       shownPreviews.clear();
//       previewContainer.innerHTML = "";
//
//       // use event delegeation chatgpt.
//       await openCouncilPage();
//     } catch (err) {
//       console.error("Upload error:", err);
//     }
//   });
//
//   // DROPPPING IMAGES AND IMAGE PREVIEWS
//
//   // not relying  on the native file type click
//   dropZone.addEventListener("click", () => fileInput.click());
//
//   dropZone?.addEventListener("drop", (e) => {
//     e.preventDefault();
//     const files = e.dataTransfer?.files;
//     if (files && files.length > 0) {
//       // Create new DataTransfer to properly handle files
//       const dataTransfer = new DataTransfer();
//       Array.from(files).forEach((file) => dataTransfer.items.add(file));
//       fileInput.files = dataTransfer.files;
//
//       // Trigger the input event
//       fileInput.dispatchEvent(new Event("input"));
//     }
//   });
//
//   fileInput.addEventListener("input", () => {
//     if (fileInput.files && fileInput.files.length > 0) {
//       showPreviews(fileInput.files);
//     }
//   });
//
//   const shownPreviews = new Set<string>(); // file.name + file.size
//   function showPreviews(files: FileList | null) {
//     console.log("Showing previews for files:", files);
//
//     previewContainer.innerHTML = "";
//     shownPreviews.clear();
//
//     // Clear existing previews except instructions
//     Array.from(dropZone?.children).forEach((child) => {
//       if (child.id !== "image-upload" && !child.matches("p:first-child")) {
//         child.remove();
//       }
//     });
//
//     const instructionText = dropZone?.querySelector(
//       "p:first-child",
//     ) as HTMLElement;
//     if (instructionText) {
//       instructionText.style.display = files?.length ? "none" : "block";
//     }
//
//     if (!files || files.length === 0) {
//       return;
//     }
//
//     Array.from(files).forEach((file) => {
//       const hash = `${file.name}-${file.size}`;
//       if (shownPreviews.has(hash)) return; // skip duplicates
//
//       shownPreviews.add(hash);
//
//       if (file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const img = document.createElement("img");
//           img.src = e.target?.result as string;
//           img.alt = file.name;
//           img.classList.add("preview-image");
//           img.width = 150;
//           previewContainer.appendChild(img);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         const fileName = document.createElement("p");
//         fileName.textContent = file.name;
//         fileName.style.color = "#ff6666";
//         previewContainer.appendChild(fileName);
//       }
//     });
//
//     dropZone.appendChild(previewContainer);
//   }
//
//   // DELETING IMAGES
//
//   const container = document.getElementById("data-container") as HTMLElement;
//
//   container.addEventListener("click", async (e) => {
//     const target = e.target as HTMLElement;
//
//     const deleteBtn = target.closest("button.delete") as HTMLElement | null;
//     if (!deleteBtn) return;
//
//     const imgContainer = deleteBtn.closest(
//       ".council-image-item",
//     ) as HTMLElement | null;
//     if (!imgContainer) return;
//
//     const id = imgContainer.dataset.id;
//     if (!id) return;
//
//     fetch(`/api/v1/councils/delete/${id}`, {
//       method: "DELETE",
//     })
//       .then(async (res) => {
//         if (!res.ok) {
//           const msg = await res.text();
//           throw new Error(msg || "Failed to delete");
//         }
//
//         imgContainer.remove();
//
//         const remaining = container.querySelectorAll(".council-image-item");
//         if (remaining.length === 0) {
//           document.querySelector(".image-list-container")!.innerHTML =
//             "<h4 class='muted-2'>Empty council images...</h4>";
//         }
//       })
//       .catch((err) => {
//         notifyError("Failed to delete image. Please try again later.");
//         console.error("Error deleting slideshow:", err);
//       });
//   });
// }
//

import { notifyError, notifyInfo } from "@utils/showNotif.ts";
import openCouncilPage from "./page.ts";
import { showLoading } from "@components/loadingSpinner.ts";

export default function initEvents() {
  // Track previews
  const shownPreviews = new Set<string>();

  // Delegate click events
  document.body.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;

    // Open popup
    if (target.matches("#btn-open-upload-popup")) {
      shownPreviews.clear();
      const fileInput = document.getElementById(
        "image-upload-council",
      ) as HTMLInputElement;
      const previewContainer = document.querySelector(
        ".img-preview-container",
      ) as HTMLElement;
      const dropZone = document.getElementById(
        "drop-zone-council",
      ) as HTMLElement;

      fileInput.value = "";
      previewContainer.innerHTML = "";
      overlay().classList.add("show");
      dropZone
        .querySelector("p:first-child")
        ?.setAttribute("style", "display:block");
    }

    // Close popup
    if (
      (target === overlay() || target.closest("nav")) &&
      overlay().classList.contains("show")
    ) {
      overlay().classList.remove("show");
    }

    // Form submit handled separately via submit event

    // Delete image
    if (
      target.matches(".council-image-item button.delete") ||
      target.closest(".council-image-item button.delete")
    ) {
      const btn = target.closest("button.delete") as HTMLButtonElement;
      const imgContainer = btn.closest<HTMLElement>(".council-image-item");
      const id = imgContainer?.dataset.id;
      if (!id) return;

      try {
        const res = await fetch(`/api/v1/councils/delete/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error((await res.text()) || "Delete failed");
        imgContainer.remove();
        const remaining = document.querySelectorAll(".council-image-item");
        if (remaining.length === 0) {
          document.querySelector(".image-list-container")!.innerHTML =
            "<h4 class='muted-2'>Empty council images...</h4>";
        }
      } catch (err) {
        notifyError("Failed to delete image. Please try again later.");
        console.error(err);
      }
    }
  });

  // Delegate input event for file selection
  document.body.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.id !== "image-upload-council") return;
    const files = target.files;
    const previewContainer = document.querySelector(
      ".img-preview-container",
    ) as HTMLElement;
    const dropZone = document.getElementById(
      "drop-zone-council",
    ) as HTMLElement;

    if (!files) return;
    showPreviews(files, shownPreviews, previewContainer, dropZone);
  });

  // Delegate drop and drag events
  ["dragenter", "dragover"].forEach((ev) =>
    document.body.addEventListener(ev, (e) => {
      const dz = (e.target as HTMLElement).closest("#drop-zone-council");
      if (!dz) return;
      e.preventDefault();
      dz.classList.add("dragover");
    }),
  );
  ["dragleave", "drop"].forEach((ev) =>
    document.body.addEventListener(ev, (e) => {
      const dz = (e.target as HTMLElement).closest("#drop-zone-council");
      if (!dz) return;
      e.preventDefault();
      dz.classList.remove("dragover");
      if (ev === "drop") {
        const files = (e as DragEvent).dataTransfer?.files;
        if (files) {
          const input = document.getElementById(
            "image-upload-council",
          ) as HTMLInputElement;
          const dt = new DataTransfer();
          Array.from(files).forEach((f) => dt.items.add(f));
          input.files = dt.files;
          input.dispatchEvent(new Event("input"));
        }
      }
    }),
  );

  // Delegate submit for upload form
  document.body.addEventListener("submit", async (e) => {
    const form = e.target as HTMLFormElement;
    if (form.id !== "council-upload-form") return;
    e.preventDefault();

    const input = document.getElementById(
      "image-upload-council",
    ) as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      alert("Please select a file.");
      return;
    }

    // Dedupe and append
    const fileArray = Array.from(files);
    const unique = Array.from(
      fileArray.reduce((m, f) => m.set(`${f.name}-${f.size}`, f), new Map()),
    ).map(([, f]) => f);
    const formData = new FormData();
    unique.forEach((f) => formData.append("images", f));

    // Spinner
    const btn = document.querySelector(".upload-btn") as HTMLButtonElement;
    btn.disabled = true;
    showLoading(btn, "small");

    try {
      const res = await fetch("api/v1/councils/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      overlay().classList.remove("show");
      notifyInfo("Upload success");
      await openCouncilPage(); // DOM replaced
    } catch (err) {
      notifyError("Upload failed, try again.");
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.innerText = "Upload";
    }
  });
}

// Helper to get overlay
function overlay() {
  return document.getElementById("council-upload-popup-overlay")!;
}

// Preview logic
function showPreviews(
  files: FileList,
  shown: Set<string>,
  container: HTMLElement,
  dropZone: HTMLElement,
) {
  container.innerHTML = "";
  shown.clear();
  Array.from(dropZone.children).forEach((c) => {
    if (c.id !== "image-upload-council" && !c.matches("p:first-child"))
      c.remove();
  });
  dropZone.querySelector<HTMLElement>("p:first-child")!.style.display =
    files.length ? "none" : "block";

  Array.from(files).forEach((file) => {
    const key = `${file.name}-${file.size}`;
    if (shown.has(key)) return;
    shown.add(key);
    if (file.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target!.result as string;
        img.alt = file.name;
        img.classList.add("preview-image");
        img.width = 150;
        container.appendChild(img);
      };
      r.readAsDataURL(file);
    } else {
      const p = document.createElement("p");
      p.textContent = file.name;
      p.style.color = "#ff6666";
      container.appendChild(p);
    }
  });
  dropZone.appendChild(container);
}

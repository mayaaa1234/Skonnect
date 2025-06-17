import { notifyError, notifyInfo } from "@utils/showNotif.ts";
import { fetchAllImageURLs } from "./data.ts";
import openCouncilPage from "./page.ts";

export default function initEvents() {
  const overlay = document.getElementById("council-upload-popup-overlay")!;
  const openPopup = document.getElementById("btn-open-upload-popup");
  const editSlideshows = document.getElementById("btn-edit-slideshows");
  const dropZone = document.getElementById("drop-zone-council") as HTMLElement;
  const fileInput = document.getElementById(
    "image-upload-council",
  ) as HTMLInputElement;
  const nav = document.querySelector("nav")!;
  const previewContainer = document.querySelector(
    ".img-preview-container",
  ) as HTMLElement;

  // TOGGLE, DRAG, AND DROP EVENTS

  if (!openPopup) {
    console.log("cant find openPopup.");
    return;
  }
  openPopup.addEventListener("click", () => {
    shownPreviews.clear();
    fileInput.value = "";
    previewContainer.innerHTML = "";

    overlay?.classList.add("show");

    const instructionText = dropZone?.querySelector(
      "p:first-child",
    ) as HTMLElement;
    if (instructionText) {
      instructionText.style.display = "block";
    }
  });

  document.addEventListener("click", (e) => {
    if (overlay?.matches(".show")) {
      if (e.target === overlay || e.target === nav) {
        overlay?.classList.remove("show");

        // clear
        // previewContainer.innerHTML = "";
        // fileInput.value = "";
        // shownPreviews.clear();
      }
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("dragover");
    });
  });

  // UPLOADING THE FILE FORM

  const form = document.getElementById(
    "council-upload-form",
  ) as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    shownPreviews.clear();

    const files = fileInput.files;

    if (!files || files.length === 0) {
      alert("Please select a file.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        alert("Unsupported file type.");
        return;
      }
    }

    // add in the caption and the images
    const formData = new FormData();
    for (const file of fileArray) {
      formData.append("images", file);
    }

    for (const [k, v] of (formData as any).entries()) {
      console.log(`${k}:`, v);
    }

    try {
      const res = await fetch("api/v1/councils/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        notifyError("Something went wrong. please try again later.");
        overlay?.classList.remove("show");
        throw new Error("Upload failed.");
      }

      // Success??
      overlay?.classList.remove("show");
      notifyInfo("Uploading files...");
      // const result = await res.json();
      // console.log("Upload success:", result);

      // refresh page and reinit events (i know event delegation is better)
      await openCouncilPage();
      initEvents();
    } catch (err) {
      console.error("Upload error:", err);
    }
  });

  // DROPPPING IMAGES AND IMAGE PREVIEWS

  // not relying  on the native file type click
  dropZone.addEventListener("click", () => fileInput.click());

  dropZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      // Create new DataTransfer to properly handle files
      const dataTransfer = new DataTransfer();
      Array.from(files).forEach((file) => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;

      // Trigger the input event
      fileInput.dispatchEvent(new Event("input"));
    }
  });

  fileInput.addEventListener("input", () => {
    if (fileInput.files && fileInput.files.length > 0) {
      showPreviews(fileInput.files);
    }
  });

  const shownPreviews = new Set<string>(); // file.name + file.size
  // let previewLock = false;
  function showPreviews(files: FileList | null) {
    // if (previewLock) return;
    // previewLock = true;
    previewContainer.innerHTML = "";
    shownPreviews.clear();

    // Clear existing previews except instructions
    Array.from(dropZone?.children).forEach((child) => {
      if (child.id !== "image-upload" && !child.matches("p:first-child")) {
        child.remove();
      }
    });

    const instructionText = dropZone?.querySelector(
      "p:first-child",
    ) as HTMLElement;
    if (instructionText) {
      instructionText.style.display = files?.length ? "none" : "block";
    }

    if (!files || files.length === 0) {
      // previewLock = false;
      return;
    }

    Array.from(files).forEach((file) => {
      const hash = `${file.name}-${file.size}`;
      if (shownPreviews.has(hash)) return; // skip duplicates

      shownPreviews.add(hash);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target?.result as string;
          img.alt = file.name;
          img.classList.add("preview-image");
          img.width = 150;
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      } else {
        const fileName = document.createElement("p");
        fileName.textContent = file.name;
        fileName.style.color = "#ff6666";
        previewContainer.appendChild(fileName);
      }
    });

    dropZone.appendChild(previewContainer);

    // Unlock after brief delay (in case of rapid events)
    // setTimeout(() => {
    //   previewLock = false;
    // }, 100);
  }

  // DELETING IMAGES

  const container = document.getElementById("data-container") as HTMLElement;

  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const deleteBtn = target.closest("button.delete") as HTMLElement | null;
    if (!deleteBtn) return;

    const imgContainer = deleteBtn.closest(
      ".council-image-item",
    ) as HTMLElement | null;
    if (!imgContainer) return;

    const id = imgContainer.dataset.id;
    if (!id) return;

    fetch(`/api/v1/councils/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        imgContainer.remove();

        const remaining = container.querySelectorAll(".council-image-item");
        if (remaining.length === 0) {
          document.querySelector(".image-list-container")!.innerHTML =
            "<h4 class='muted-2'>Empty council images...</h4>";
        }
      })
      .catch((err) => {
        notifyError("Failed to delete image. Please try again later.");
        console.error("Error deleting slideshow:", err);
      });
  });
}

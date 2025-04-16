import { warn } from "console";
import { notifyError, notifySuccess, notifyInfo } from "@utils/showNotif.ts";

export default function uploadEventListener() {
  const overlay = document.getElementById("upload-popup-overlay")!;
  const openPopup = document.getElementById("btn-open-upload-popup");
  const editSlideshows = document.getElementById("btn-edit-slideshows");
  const inputCaption = document.querySelector(
    ".upload-input-caption",
  ) as HTMLInputElement;

  const dropZone = document.getElementById("drop-zone") as HTMLElement;
  const nav = document.querySelector("nav")!;

  // TOGGLE, DRAG, AND DROP EVENTS

  if (!openPopup) {
    console.log("cant find openPopup.");
    return;
  }
  openPopup.addEventListener("click", () => {
    overlay?.classList.add("show");
    inputCaption?.focus();
  });

  document.addEventListener("click", (e) => {
    if (overlay?.matches(".show")) {
      if (e.target === overlay || e.target === nav) {
        overlay?.classList.remove("show");
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

  const form = document.getElementById("upload-form") as HTMLFormElement;

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputCaption = document.querySelector(
      ".upload-input-caption",
    ) as HTMLInputElement;
    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    const files = fileInput.files;

    if (!inputCaption.value.trim()) {
      alert("Please enter a caption.");
      return;
    }

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
    formData.append("caption", inputCaption.value.trim());
    for (const file of fileArray) {
      formData.append("images", file);
    }

    for (const [k, v] of (formData as any).entries()) {
      console.log(`${k}:`, v);
    }

    try {
      const res = await fetch("api/v1/slides", {
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
      const result = await res.json();
      console.log("Upload success:", result);
    } catch (err) {
      console.error("Upload error:", err);
    }
  });

  // DROPPPING IMAGES AND IMAGE PREVIEWS

  const fileInput = document.getElementById("image-upload") as HTMLInputElement;

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

  const previewContainer = document.querySelector(
    ".img-preview-container",
  ) as HTMLElement;

  function showPreviews(files: FileList | null) {
    // Clear existing previews but keep the input
    Array.from(dropZone?.children).forEach((child) => {
      if (child.id !== "image-upload" && !child.matches("p:first-child")) {
        child.remove();
      }
    });

    // Toggle initial text visibility
    const instructionText = dropZone?.querySelector(
      "p:first-child",
    ) as HTMLElement;
    if (instructionText) {
      instructionText.style.display = files?.length ? "none" : "block";
    }

    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target?.result as string;
          img.alt = file.name;
          img.classList.add("preview-image");
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

    dropZone?.appendChild(previewContainer);
  }
}

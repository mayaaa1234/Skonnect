const dropZone = document.getElementById("drop-zone")!;
const fileInput = document.getElementById("image-upload") as HTMLInputElement;

if (dropZone && fileInput) {
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

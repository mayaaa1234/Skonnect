const form = document.getElementById("upload-form") as HTMLFormElement;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("image-upload") as HTMLInputElement;
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

  const formData = new FormData();

  for (const file of fileArray) {
    formData.append("images", file);
  }

  try {
    const res = await fetch("api/v1/slides", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed.");

    const result = await res.json();
    console.log("Upload success:", result);
  } catch (err) {
    console.error("Upload error:", err);
  }
});

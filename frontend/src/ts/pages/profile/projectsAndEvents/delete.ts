export default async function deleteSlideshowEventListener(): Promise<void> {
  const container = document.getElementById("data-container") as HTMLElement;

  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const deleteBtn = target.closest(
      ".slideshow-del-btn",
    ) as HTMLElement | null;
    if (!deleteBtn) {
      console.log("no del btn");
      return;
    }

    const slideshow = deleteBtn.closest(".slideshow") as HTMLElement | null;

    if (!slideshow) {
      console.log("no slide ");
      return;
    }

    const slideshowId = slideshow.dataset.slideshowId;
    if (!slideshowId) {
      console.log("no id ");
      return;
    }

    fetch(`/api/v1/slides/${slideshowId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        slideshow.remove();
      })
      .catch((err) => {
        console.error("Error deleting slideshow:", err);
      });
  });
}

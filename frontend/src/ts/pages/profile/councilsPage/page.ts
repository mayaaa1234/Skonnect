import imageList from "./ui/imageList.ts";
import controlBtn from "./ui/button.ts";
import uploadPopup from "./ui/popup.ts";

import { notifyError } from "@utils/showNotif.ts";

const container = document.getElementById("data-container") as HTMLElement;

export default async function openCouncilPage(): Promise<void> {
  container.innerHTML = "";

  // positioned absolute popup
  document.body.insertAdjacentHTML("beforeend", uploadPopup() as string);

  const councilPageContainer = document.createElement("div");
  councilPageContainer.className = "mt-4 council-page-container";

  const controlBtnContainer = document.createElement("div");
  controlBtnContainer.className = "as-e";

  const imageListContainer = document.createElement("div");
  imageListContainer.className =
    "br-10 border-subtle-effect image-list-container";

  try {
    imageListContainer.innerHTML = (await imageList()) as string;
    controlBtnContainer.innerHTML = controlBtn() as string;

    councilPageContainer.appendChild(controlBtnContainer);
    councilPageContainer.appendChild(imageListContainer);

    container.appendChild(councilPageContainer);
  } catch (error) {
    console.error("Error loading council images:", error);
    notifyError("Failed to load council images.");
  }
}

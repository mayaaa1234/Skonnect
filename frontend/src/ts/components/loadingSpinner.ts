function showLoading(container: HTMLElement, size?: "small"): void {
  container.innerHTML = "";

  // spinner container
  const spinnerContainer = document.createElement("div");
  spinnerContainer.id = "spinner-container";

  // spinner
  const spinner = document.createElement("div");
  spinner.id = "spinner";

  spinnerContainer.appendChild(spinner);

  if (size && size === "small") {
    spinner.classList.add("small");
  }

  container.appendChild(spinnerContainer);
}

function hideLoading(): void {
  const spinner = document.getElementById("spinner-container");
  if (spinner) spinner.remove();
}

export { hideLoading, showLoading };

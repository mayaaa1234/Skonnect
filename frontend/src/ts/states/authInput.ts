const inputs = document.querySelectorAll<HTMLInputElement>(".input-box input");
if (inputs) {
  console.log({ inputs });
  inputs.forEach((input) => {
    input.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const label = target
        .closest(".input-box")
        ?.querySelector("label") as HTMLLabelElement;
      console.log("label:", label);

      if (label) {
        if (target.value) {
          // When input has value
          label.style.top = "-5px";
        } else {
          // When input is empty
          label.style.top = "50%";
        }
      }
    });
  });
}

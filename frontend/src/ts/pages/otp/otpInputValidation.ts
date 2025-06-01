const otpInput = document.getElementById("otp-input") as HTMLInputElement;
const errDiv = document.querySelector(".error-div") as HTMLDivElement;

function showError(message: string) {
  // errDiv.classList.remove("dp-n");
  errDiv.innerText = message;
  otpInput.classList.add("invalid");
}

function clearError() {
  // errDiv.classList.add("dp-n");
  errDiv.innerText = "";
  otpInput.classList.remove("invalid");
}

function validateField(field: HTMLInputElement) {
  // remove the dashes to validate properly
  const val = field.value.replace(/-/g, "").trim();

  if (!val) {
    showError("field can't be empty");
    return;
  } else {
    clearError();
  }

  if (isNaN(Number(val))) {
    showError("field value must be a number");
    return;
  } else {
    clearError();
  }
}
export { showError, clearError, validateField };

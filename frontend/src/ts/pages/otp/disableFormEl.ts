export function setSubmitDisabled(isDisabled: boolean) {
  const submitOtpBtn = document.querySelector(
    ".submit-otp-btn",
  ) as HTMLButtonElement | null;

  if (submitOtpBtn) {
    submitOtpBtn.disabled = isDisabled;
    submitOtpBtn.classList.toggle("disabled", isDisabled);
  }
}

export function setInputDisabled(isDisabled: boolean) {
  const input = document.querySelector(".otp-input");
  if (input instanceof HTMLInputElement) {
    input.disabled = isDisabled;
    input.classList.toggle("disabled", isDisabled);
  }
}

export function setResendDisabled(isDisabled: boolean) {
  const resendOtpBtn = document.querySelector(
    ".resend-otp-btn",
  ) as HTMLButtonElement | null;

  if (resendOtpBtn) {
    resendOtpBtn.disabled = isDisabled;
    resendOtpBtn.classList.toggle("disabled", isDisabled);
  }
}

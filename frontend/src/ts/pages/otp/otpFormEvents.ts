import { notifyError, notifyInfo } from "@utils/showNotif.ts";
// import { OtpInfo } from "@ts-pages/signup/signupValidation.ts";
import { validateField } from "./otpInputValidation.ts";
import { otpVerification } from "./otpApi.ts";
import { showLoading, hideLoading } from "@components/loadingSpinner.ts";
import {
  renderExpiresAtInInterval,
  renderResendCooldownInInterval,
  renderAttemptsLeft,
  clearTimer,
  clearAttempts,
  // updateTimeLeft,
} from "./attempts-timer.ts";
import { setInputDisabled, setSubmitDisabled } from "./disableFormEl.ts";
import { requestOtp } from "./otpApi.ts";

interface ErrorResponse {
  status: string;
  msg: string;
  attempts_left: number;
  created_at: string;
  expires_at: string;
}

const otpInput = document.getElementById("otp-input") as HTMLInputElement;
const errDiv = document.querySelector(".error-div") as HTMLDivElement;
// const resendErrDiv = document.querySelector(
//   ".resend-err-div",
// ) as HTMLDivElement;
const submitOtpBtn = document.querySelector(
  ".submit-otp-btn",
) as HTMLButtonElement;
const resendOtpBtn = document.querySelector(
  ".resend-otp-btn",
) as HTMLButtonElement;

export default async function initOtpFormEvents() {
  initOtpInput();
  await initOtpSubmit();
  await initOtpResend();
}

function initOtpInput() {
  otpInput.addEventListener("input", (e: Event) => {
    const input = e.target as HTMLInputElement;

    validateField(input);

    // remove non digits and add in dashes in between numbers
    const digits = input.value.replace(/\D/g, "").trim();
    const formatted = digits.split("").join("-");
    input.value = formatted;
  });
}

interface RequestOtpError {
  status: string;
  msg: string;
}

async function initOtpResend() {
  resendOtpBtn.addEventListener("click", async () => {
    const email = sessionStorage.getItem("email");
    if (!email) {
      notifyError("Something went wrong, try signing up again");
      return;
    }

    showLoading(resendOtpBtn, "small");
    resendOtpBtn.disabled = true;

    try {
      const response = await requestOtp(email);
      if (!response) return;

      const result = await response.json();

      if (!response.ok) {
        if (typeof result.errs === "object" && "cooldownTime" in result.errs) {
          renderResendCooldownInInterval(result.errs.cooldownTime);
          console.error("result errors", result.errs);
        }
        return;
      }
      const { expires_at, attempts_left } = result;

      renderAttemptsLeft(attempts_left);
      renderExpiresAtInInterval(expires_at);
      notifyInfo("A new OTP has been sent to your device.");
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      notifyError("Failed to resend OTP. Try again.");
    } finally {
      resendOtpBtn.disabled = false;
      resendOtpBtn.innerText = "Resend";
      setInputDisabled(false);
      setSubmitDisabled(false);
      // hideLoading();
    }
  });
}

async function initOtpSubmit() {
  const form = document.querySelector("form") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      validateField(otpInput);
      if (!otpInput.validity.valid) {
        console.log("error validity");
        return;
      }

      if (otpInput.classList.contains("invalid")) {
        console.log("error validation check");
        return;
      }

      const email = sessionStorage.getItem("email"); // stored email from signup validation
      const otp = otpInput.value.replace(/-/g, "").trim(); // remove dashes and whitespaces
      if (!email) {
        notifyError("Something went wrong, try signing up again");
        return;
      }

      console.log({ email, otp });

      showLoading(submitOtpBtn);
      submitOtpBtn.disabled = true;
      const response = await otpVerification(email, otp);
      if (!response) {
        notifyError("Something went wrong, try signing up again");
        return;
      }

      showLoading(submitOtpBtn, "small");

      const result = await response
        .json()
        .catch(() => console.log("response parse failed"));
      console.log(result);

      if (!response.ok) {
        if ((result.errs as ErrorResponse) && typeof result.errs === "object") {
          const { status, msg, attempts_left, expires_at, created_at } =
            result.errs;
          const attempsLeft = Number(attempts_left);

          if (status === "expired") {
            errDiv.innerHTML = msg;
            clearTimer();
            clearAttempts();
            return;
          }

          if (attempsLeft <= 0) {
            setSubmitDisabled(true);
            setInputDisabled(true);
            errDiv.innerText =
              "max attempts reached, click resend to try again";

            clearTimer();
            clearAttempts();
            return;
          }

          if (status === "incorrect") {
            errDiv.innerHTML = msg;
            renderExpiresAtInInterval(expires_at);
            renderAttemptsLeft(attempsLeft);
            return;
          }
        }

        console.log("err is not an object: ", result.errs);
      }

      // if account was successfully created
      if (result.user) {
        errDiv.innerHTML = "";
        clearTimer();
        clearAttempts();

        // del temp data after successful verification
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("expires_at");

        // del cookie from signup validation
        document.cookie =
          "signupValid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        sessionStorage.setItem(
          "signupSuccessNotif",
          `Welcome to SKonnect, ${result.user.username}! Your account has been successfully created`,
        );
        window.location.href = "/home";
      }
    });
  }
}

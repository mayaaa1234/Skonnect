import { notifyError } from "@utils/showNotif.ts";
import { getOtpInfoByEmail } from "./otpApi.ts";
import {
  setInputDisabled,
  setResendDisabled,
  setSubmitDisabled,
} from "./disableFormEl.ts";
import {
  renderExpiresAtInInterval,
  renderAttemptsLeft,
  renderResendCooldownInInterval,
} from "./attempts-timer.ts";

const errDiv = document.querySelector(".error-div") as HTMLDivElement;

export default async function RenderOtpStateOnLoad() {
  const email = sessionStorage.getItem("email");
  if (!email) {
    notifyError("Something went wrong, try signing up again later");
    console.log({ email });
    return;
  }

  const otpInfo = await getOtpInfoByEmail(email);

  if (!otpInfo) {
    notifyError("Something went wrong, try signing up again later");
    // console.log({ otpInfo });
    return;
  }
  const { cooldown, attempts_left, expires_at } = otpInfo;

  if (attempts_left <= 0 && cooldown && new Date(cooldown) > new Date()) {
    errDiv.innerText = "max attempts reached, click resend to try again";
    setSubmitDisabled(true);
    setInputDisabled(true);
    renderResendCooldownInInterval(cooldown.toString());
    return;
  }

  if (cooldown && new Date(cooldown) > new Date()) {
    console.log("ISO cooldown: ", cooldown ?? "cooldown is null");
    setResendDisabled(true);
    renderResendCooldownInInterval(cooldown.toString());
    return;
  }

  if (attempts_left <= 0) {
    errDiv.innerText = "max attempts reached, click resend to try again";
    setSubmitDisabled(true);
    setInputDisabled(true);
    return;
  }

  const expires = new Date(expires_at);
  if (expires <= new Date()) {
    console.log("is expired hit");
    setSubmitDisabled(true);
    setInputDisabled(true);
    errDiv.innerText = "OTP expired, please request a new OTP";
    return;
  }

  renderAttemptsLeft(attempts_left);
  renderExpiresAtInInterval(expires_at);
}

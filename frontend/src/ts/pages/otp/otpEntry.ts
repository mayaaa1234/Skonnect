import RenderOtpStateOnLoad from "./onPageLoad.ts";
import initOtpFormEvents from "./otpFormEvents.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await RenderOtpStateOnLoad();
  await initOtpFormEvents();
});

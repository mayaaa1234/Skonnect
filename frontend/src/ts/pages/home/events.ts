import { notifySuccess } from "../../utils/showNotif.ts";

document.addEventListener("DOMContentLoaded", () => {
  const message = sessionStorage.getItem("signupSuccessNotif");
  if (message) {
    notifySuccess(message, true);
    sessionStorage.removeItem("signupSuccessNotif");
  }
});

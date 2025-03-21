import { notifySuccess } from "../../utils/showNotif.ts";

const signupMsg = sessionStorage.getItem("signupSuccessNotif");
const loginMsg = sessionStorage.getItem("loginWelcomeNotif");
if (signupMsg) {
  notifySuccess(signupMsg, true);
  sessionStorage.removeItem("signupSuccessNotif");
} else if (loginMsg) {
  notifySuccess(loginMsg, true);
  sessionStorage.removeItem("loginWelcomeNotif");
}

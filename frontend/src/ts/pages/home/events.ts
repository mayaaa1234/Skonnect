import { notifyGradient } from "../../utils/showNotif.ts";

const signupMsg = sessionStorage.getItem("signupSuccessNotif");
const loginMsg = sessionStorage.getItem("loginWelcomeNotif");
if (signupMsg) {
  notifyGradient(signupMsg);
  sessionStorage.removeItem("signupSuccessNotif");
} else if (loginMsg) {
  notifyGradient(loginMsg);
  sessionStorage.removeItem("loginWelcomeNotif");
}

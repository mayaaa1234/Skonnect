// import { setState } from "../../utils/setGetState.ts";
import { notifyError } from "../../utils/showNotif.ts";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OtpInfo {
  id: number;
  attempts_left: number;
  created_at: string;
  expires_at: string;
}

interface SignupValidationSuccess {
  otpInfo: OtpInfo;
}

interface Error {
  errs: Record<string, string>;
}

type SignupValidationResponse = SignupValidationSuccess | Error;

const signupValidation = async (jsonData: SignupData) => {
  try {
    const response = await fetch("/api/v1/auth/signup/validation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
      credentials: "include",
    });

    const result = (await response.json()) as SignupValidationResponse;
    // console.log({ response });

    //INFO: if validation failed on the BE it sends an json obj
    if (!response.ok) {
      console.log("signup validation failed");

      if ("errs" in result && typeof result.errs === "object") {
        // clear prev errs
        document
          .querySelectorAll(".signup-error-msg")
          .forEach((el) => (el.textContent = ""));

        Object.entries(result.errs).forEach(([fieldName, message]) => {
          const errorDiv = document.querySelector(
            `.signup-error-msg[data-error-for="${fieldName}"]`,
          ) as HTMLElement | null;

          if (errorDiv) {
            errorDiv.textContent = message as string;
          }
        });
      }
      return;
    }

    if ("otpInfo" in result) {
      sessionStorage.setItem("otpInfo", JSON.stringify(result.otpInfo));
    }
    document.cookie = "signupValid=true; path=/";
    window.location.href = "/signup/otp-authentication";
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");
    return;
  }
};

export default signupValidation;

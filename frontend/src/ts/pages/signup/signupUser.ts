import { setState } from "../../utils/setGetState.ts";
import { notifySuccess, notifyError } from "../../utils/showNotif.ts";

const signupContainer = document.querySelector(".signup-form-container")

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const signupUser = async (jsonData: SignupData) => {
  try {
    const response = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
      credentials: "include",
    });

    console.log({ response });
    const result = await response.json();

    //INFO: if validation failed on the BE it sends an json obj
    if (!response.ok) {
      console.log("signup validation failed");

      if (result.errs && typeof result.errs === "object") {
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

    // saving this for illusory transcedental notif accross pages
    sessionStorage.setItem(
      "signupSuccessNotif",
      "Account created successfully!",
    );

    console.log("Signup successful", result);
    //notifySuccess("Account created successfully!");

    window.location.href = "/home";
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");

    //document.cookie =
    //  "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return;
  }
};

export default signupUser;

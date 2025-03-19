import { saveState } from "../../utils/saveState.ts";
import { notifySuccess, notifyError } from "../../utils/showNotif.ts";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminKey?: string;
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

    if (!response.ok) {
      console.error("Signup failed:", result.message || "Unknown error");
      notifyError(result.message || "Signup failed");

      saveState("isLoggedIn", false);
      document.cookie =
        "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return;
    }

    // saving this for illusory transcedental notif accross pages
    sessionStorage.setItem(
      "signupSuccessNotif",
      "Account created successfully!",
    );

    saveState("isLoggedIn", true);

    console.log("Signup successful", result);
    notifySuccess("Account created successfully!");

    window.location.href = "/home";
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");

    saveState("isLoggedIn", false);
    document.cookie =
      "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return;
  }
};

export default signupUser;

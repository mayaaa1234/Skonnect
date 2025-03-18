import { notifySuccess, notifyError } from "../../utils/showNotif.ts";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminKey?: string;
}

const createAccount = async (jsonData: SignupData) => {
  try {
    const response = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
      credentials: "include",
    });
    console.log({ response });

    if (!response.ok) {
      const result = await response.json();
      console.error("Signup failed:", result.message || "Unknown error");
      notifyError(result.message || "Signup failed");
      return;
    }

    const result = await response.json();

    // saving this for illusory transcedental notif accross pages
    sessionStorage.setItem(
      "signupSuccessNotif",
      "Account created successfully!",
    );

    console.log("Signup successful", result);
    notifySuccess("Account created successfully!");
    window.location.href = "/home";
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");
  }
};

export default createAccount;

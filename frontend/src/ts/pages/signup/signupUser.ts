import { setState } from "../../utils/setGetState.ts";
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
      let errMsg = "Signup failed";
      const err = result.err;
      console.log(typeof err);

      if (err) {
        if (typeof err === "string") {
          errMsg = err;
        } else if (typeof err === "object") {
          // Extract first error message from the object
          const firstKey = Object.keys(err)[0];
          errMsg = err[firstKey] || errMsg;
        }
      }

      console.log("err msg: ", errMsg);
      notifyError(errMsg);
      //console.log("signup err: ", result.err);
      //const errMsg = result.err
      //  ? typeof result.err === "string"
      //    ? result.err
      //    : JSON.stringify(result.err)
      //  : "Signup failed";
      //notifyError(errMsg);
      //notifyError(errMsg || "Signup failed");
      return;

      //document.cookie =
      //  "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

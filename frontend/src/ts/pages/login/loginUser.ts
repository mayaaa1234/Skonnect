import { notifySuccess, notifyError } from "../../utils/showNotif.ts";
import { setState } from "../../utils/setGetState.ts";

//TODO: decide if im gonna use global var for isLoggedIn or localStorage

export interface LoginData {
  username?: string;
  email?: string;
  password: string;
}

export default async function loginUser(jsonData: LoginData) {
  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
      credentials: "include",
    });
    console.log({ response });
    const result = await response.json();

    if (!response.ok) {
      console.error("Login failed:", result.message || "Unknown error");
      notifyError(result.message || "Login failed");

      setState("isLoggedIn", false);
      //document.cookie =
      //  "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return;
    }

    // saving this for illusory transcedental notif accross pages
    sessionStorage.setItem("loginWelcomeNotif", "Welcome!");

    setState("isLoggedIn", true);
    console.log("Login successful", result);
    //notifySuccess("Welcome!");

    window.location.href = "/home";
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");

    setState("isLoggedIn", false);
    //document.cookie =
    //  "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

//import jwtDecode from "jwt-decode";
//
//const token = document.cookie
//  .split("; ")
//  .find(row => row.startsWith("authorization="))
//  ?.split("=")[1];
//
//if (token) {
//  try {
//    const decoded = jwtDecode(token);
//    if (decoded.exp * 1000 > Date.now()) {
//      window.location.href = "/home"; // Redirect if token is valid
//    }
//  } catch (error) {
//    console.error("Invalid token", error);
//  }
//}

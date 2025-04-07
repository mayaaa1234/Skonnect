import { setState } from "../../utils/setGetState.ts";

document.addEventListener("DOMContentLoaded", () => {
  async function logout() {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      console.log("Logout success");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  const logoutBtn = document.querySelector("button.logout");
  logoutBtn?.addEventListener("click", () => logout());
});

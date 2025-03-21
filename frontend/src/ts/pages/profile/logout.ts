import { toggleNavAuth } from "../../states/loggedIn.ts";

document.addEventListener("DOMContentLoaded", () => {
  async function logout() {
    try {
      const response = await fetch("/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      console.log("Logout success");

      toggleNavAuth(false);
      window.location.href = "/login";
      //window.location.reload();
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  const logoutBtn = document.querySelector("button.logout");
  logoutBtn?.addEventListener("click", () => logout());
});

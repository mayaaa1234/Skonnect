// import { setState } from "../../utils/setGetState.ts";
// import { setState } from "@utils/setGetState.ts";

export default async function logoutEventListener() {
  const logoutBtn = document.querySelector(".logout");
  if (!logoutBtn) {
    console.log("aspdlfj");
    return;
  }
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        throw new Error("Logout failed");
      }
      console.log("Logout success");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout", error);
    }
  });
}

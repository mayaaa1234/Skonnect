import { notifySuccess } from "../utils/showNotif.ts";
import { setState, getState } from "../utils/setGetState.ts";

let authCache: boolean | null = null;

async function checkAuth(): Promise<boolean> {
  if (authCache !== null) return authCache;

  try {
    const response = await fetch("/api/v1/user/status", {
      credentials: "include",
    });

    if (!response.ok) {
      authCache = false;
      return false;
    }

    const data = await response.json();
    authCache = data.isAuthenticated;
    return data.isAuthenticated;
  } catch (error) {
    console.error("Error checking auth status:", error);
    authCache = false;
    return false;
  }
}

export function toggleNavAuth(isLoggedIn: boolean): void {
  const nav = document.querySelector("nav") as HTMLElement;
  console.log("Auth state:", isLoggedIn);
  nav.classList.toggle("isLoggedIn", isLoggedIn);
  nav.classList.toggle("isLoggedOut", !isLoggedIn);
  console.log("Current nav classes:", nav.classList);
}

document.addEventListener("DOMContentLoaded", async () => {
  // For signup, login, or landing pages, set loggedOut ui immediately.
  if (
    document.body.dataset.page === "signup" ||
    document.body.dataset.page === "login" ||
    document.body.dataset.page === "landing"
  ) {
    toggleNavAuth(false);
    return;
  }

  const isLoggedIn = await checkAuth();
  setState("isLoggedIn", String(isLoggedIn));
  toggleNavAuth(isLoggedIn);
});

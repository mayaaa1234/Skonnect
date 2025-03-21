import { notifySuccess } from "../utils/showNotif.ts";
import { setState, getState } from "../utils/setGetState.ts";

//let authCache: boolean | null = null;

async function checkAuth(): Promise<boolean> {
  //if (authCache !== null) return authCache;

  try {
    const response = await fetch("/api/v1/user/status", {
      credentials: "include",
    });

    if (!response.ok) {
      //authCache = false;
      return false;
    }

    const data = await response.json();
    //authCache = data.isAuthenticated;
    return data.isAuthenticated;
  } catch (error) {
    console.error("Error checking auth status:", error);
    //authCache = false;
    return false;
  }
}

function toggleNavAuth(isLoggedIn: boolean): void {
  const nav = (document.querySelector("nav") as HTMLElement) || null;
  console.log("isLoggedIn:", isLoggedIn);
  nav?.classList.toggle("isLoggedIn", isLoggedIn);
  nav?.classList.toggle("isLoggedOut", !isLoggedIn);
}

async function checkLoginStatus() {
  // force checkAuth on every page load to bypass browser bfcache
  const isLoggedIn = await checkAuth();
  setState("isLoggedIn", String(isLoggedIn));
  toggleNavAuth(isLoggedIn);
}
window.addEventListener("pageshow", checkLoginStatus);

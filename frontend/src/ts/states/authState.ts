/*
 * Retrieves the authentication status.
 */
export async function getAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch("/api/v1/user/status", {
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    return true; // idk this just faster
    //const data: { isAuthenticated: boolean } = await response.json();
    //return data.isAuthenticated;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}

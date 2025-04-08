import logoutEventListener from "./logout.ts";
import openProfileData from "./openProfile.ts";
import onDOMReady from "../../../utils/onDOMReady.ts";
export default async function initProfilePage() {
  onDOMReady(async () => {
    await openProfileData();
    await logoutEventListener();
  });
}

//INFO: shared scripts across pages goes here

// global states
import "./states/theme.ts";
import "./states/pageLoaded.ts";
import "./states/pages/profile/state.ts";
// import "./states/authInput.ts";

// admin
import "./admin/upload/image-preview.ts";
import "./admin/upload/events.ts";
import "./admin/upload/form-upload.ts";

// page states
import {
  clearActiveSidebar,
  clearSidebarSelectedKey,
} from "./pages/profile/sidebar/events.ts";

document.addEventListener("DOMContentLoaded", () => {
  console.log("testing bs");
  // clearActiveSidebar();
  // clearSidebarSelectedKey();
});

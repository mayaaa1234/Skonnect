//INFO: shared scripts across pages goes here

// global states
import "./states/theme.ts";
import "./states/pageLoaded.ts";
import "./states/pages/profile/state.ts";
// import "./states/authInput.ts";

// page states
import {
  clearActiveSidebar,
  clearSidebarSelectedKey,
} from "./pages/profile/sidebar/events.ts";

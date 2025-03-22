//import { getAuthStatus } from "../../states/authState.ts";
//import { getState } from "../../utils/setGetState.ts";

//export default function adjustNavLayout(
//  layout: "loggedIn" | "loggedOut",
//): void {
//  const dom = document.documentElement;
//  if (layout === "loggedIn") {
//    dom.classList.toggle("authed", true);
//    dom.classList.toggle("notAuthed", false);
//    console.log("dom class:", dom.classList);
//    return;
//  }
//
//  dom.classList.toggle("authed", false);
//  dom.classList.toggle("notAuthed", true);
//  console.log("dom class:", dom.classList);
//}
//
//document.addEventListener("DOMContentLoaded", async () => {
//  //assumes login-logout state based on page for faster layout shift
//  // without needing to fetch wait for the server
//  const { page } = document.body.dataset;
//  if (page && ["signup", "login", "landing"].includes(page)) {
//    adjustNavLayout("loggedOut");
//  } else {
//    adjustNavLayout("loggedIn");
//  }
//
//  // after that confirm the above layout by fetching the server
//  // which overrides the the above code if its not synced
//  const dom = document.documentElement;
//  const isAuthed: boolean = await getAuthStatus();
//
//  //if user doesnt have token but for some reason still have authed class
//  //remove it acccrdingly. This could happen the user removes
//  //the token manually or some browser event like caching and other stuff modifies it
//  if (!isAuthed && dom.classList.contains("authed")) {
//    adjustNavLayout("loggedOut");
//  }
//
//  // ofc vice versa can happen too
//  if (isAuthed && !dom.classList.contains("authed")) {
//    adjustNavLayout("loggedIn");
//  }
//});

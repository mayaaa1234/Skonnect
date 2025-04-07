import { html } from "lit-html";

const showSidebarBtn = document.querySelector(".profile-btn-show-sidebar");
const hideSidebarBtn = document.querySelector(".sidebar-btn-hide-sidebar");
const sidebar = document.getElementById("sidebar");
const dataPage = document.documentElement.dataset.page;
const dom = document.documentElement;

// TOGGLING SIDEBAR

showSidebarBtn?.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.toggle("active-sidebar");
  }
});

document.addEventListener("click", (e) => {
  if (!sidebar || !showSidebarBtn) return;

  const t = e.target as Node;

  if (
    dom.classList.contains("active-sidebar") &&
    !sidebar.contains(t) &&
    // excluding the btn itself from triggering the close
    !showSidebarBtn.contains(t)
  ) {
    dom.classList.remove("active-sidebar");
  }
});

hideSidebarBtn?.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.toggle("active-sidebar", false);
  }
});

// OPENING SPECIC DATA/INFORMATION FROM DB

const container = document.getElementById("data-container") as HTMLElement;
const sidebarUlbtns = document.querySelectorAll(
  ".sidebar-ul button",
) as NodeListOf<HTMLButtonElement>;

const DEFAULT_ACTION = "profile";
const SELECTED_KEY = "selectedSidebarBtn";

function getSelectedAction(): string {
  return localStorage.getItem(SELECTED_KEY) ?? DEFAULT_ACTION;
}

function highlightButton(action: string) {
  sidebarUlbtns.forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.action === action);
  });
}

async function openSelectedData(action: string): Promise<void> {
  switch (action) {
    case "profile":
      await openProfileData();
      break;

    case "users":
      await openUsersData();
      break;
    case "projectsAndEvents":
      await openProjectsAndEventsData();
      break;
    case "budgetAllocation":
      await openBudgetAllocationData();
      break;
    default:
      console.warn(`Unhandled action: ${action}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const action = getSelectedAction();
  highlightButton(action);
  openSelectedData(action);
});

sidebarUlbtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    container.innerHTML = "";

    console.log("click");

    const action = btn.dataset.action!;
    localStorage.setItem(SELECTED_KEY, action);

    highlightButton(action);
    openSelectedData(action);
  });
});

const openProjectsAndEventsData = () => {};
const openBudgetAllocationData = () => {};

async function openProfileData(): Promise<void> {
  try {
    const response = await fetch("/api/profile");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    // Ensure your HTML has an element with id "profile-output"
    const output = document.getElementById("profile-output");
    if (!output) {
      console.error("No element with id 'profile-output' found.");
      return;
    }
    // Determine profile image and username display based on admin status
    const profileImg = user.isAdmin
      ? "assets/img/makise.jpg"
      : "assets/img/default-profile1.png";
    const usernameDisplay = user.isAdmin
      ? `${user.username} (ADMIN)`
      : user.username;

    output.innerHTML = `
      <div class="profile-container container mt-2 dp-f fd-c ai-c gp-50">
        <div class="upper-container br-20 dp-f fd-c p-1">
          <div class="br-20 js-s upper-top p-1 dp-f ai-c jc-sb w-100">
            <h1 class="">Profile</h1>
            <button class="p-1 as-s br-40 btn-outlined-dark-accent test">
              Edit profile
            </button>
          </div>
          <div class="br-20 w-100 p-1 upper-bottom">
            <div class="mb-2 ml-n1 avatar">
              <img width="150px" class="br-full" src="${profileImg}" alt="Profile Image" />
            </div>
            <div class="mb-2 username">
              <h3>Username</h3>
              <div data-username>
                ${usernameDisplay}
              </div>
            </div>
            <div class="mb-2 email">
              <h3>Email</h3>
              <div data-email>
                ${user.email}
              </div>
            </div>
          </div>
        </div>
        <div class="lower-container dp-f p-3 jc-sb ai-c br-20">
          <div>some text</div>
          <button class="logout btn-dark-accent br-40 p-1 w-100px">
            Logout
          </button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
}

async function openUsersData(): Promise<void> {
  try {
    const response = await fetch("/api/v1/users", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    container.innerHTML = `

      <div class="container">
        <table class="user-table ">
          <thead>
            <tr >
              <th class="" style="width: 20%;">ID</th>
              <th class="" style="width: 25%;">Username</th>
              <th class="" style="width: 35%;">Email</th>
              <th class="" style="width: 20%;">Admin</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (
                  user: {
                    id: number | string;
                    username: string;
                    email: string;
                    isAdmin: boolean;
                  },
                  i: number,
                ) => `
            <tr>
              <td style="${i === 0 ? "border-top: none;" : ""}">${user.id}</td>
              <td style="${i === 0 ? "border-top: none;" : ""}">${user.username}</td>
              <td style="${i === 0 ? "border-top: none;" : ""}">${user.email}</td>
              <td style="${i === 0 ? "border-top: none;" : ""}">${user.isAdmin}</td>
            </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching users data:", error);
  }
}

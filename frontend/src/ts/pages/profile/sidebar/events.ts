import { html } from "lit-html";

import {
  Slideshow,
  fetchAllSlideShows,
} from "../../home/slideShow/fetchSlides.ts";

import initSlideIndexesAndEvents from "../../home/slideShow/slideEvents.ts";

const showSidebarBtn = document.querySelector(".profile-btn-show-sidebar") as HTMLElement;
const hideSidebarBtn = document.querySelector(".sidebar-btn-hide-sidebar") as HTMLElement;
const sidebar = document.getElementById("sidebar");
const dataPage = document.documentElement.dataset.page;
const dom = document.documentElement;

// TOGGLING SIDEBAR

export const clearActiveSidebar = () => {
  const currentDataPage = document.documentElement.dataset.page;

  if (currentDataPage !== "profile") {
    sessionStorage.removeItem("active-sidebar");
  }

  if(currentDataPage === "profile" && sessionStorage.getItem("active-sidebar")){
    dom.classList.toggle("active-sidebar", true);

  }
};

showSidebarBtn.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.toggle("active-sidebar");
    sessionStorage.setItem("active-sidebar", "true")
  }
});

// document.addEventListener("click", (e) => {
//   if (!sidebar || !showSidebarBtn) return;
//
//   const t = e.target as Node;
//
//   if (
//     dom.classList.contains("active-sidebar") &&
//     !sidebar.contains(t) &&
//     // excluding the btn itself from triggering the close
//     !showSidebarBtn.contains(t)
//   ) 
//     dom.classList.remove("active-sidebar");
//   }
// });

hideSidebarBtn?.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.toggle("active-sidebar", false);
  }
});

// OPENING SPECIFIC DATA/INFORMATION FROM DB


export const clearSidebarSelectedKey = () => {
  const currentDataPage = document.documentElement.dataset.page;
  if (currentDataPage !== "profile") {
    sessionStorage.removeItem(SELECTED_KEY);
  }

  const action = getSelectedActionOrDefault();
  highlightButton(action);
  openSelectedData(action);
};


const container = document.getElementById("data-container") as HTMLElement;
const sidebarUlbtns = document.querySelectorAll(
  ".sidebar-ul button",
) as NodeListOf<HTMLButtonElement>;

const DEFAULT_ACTION = "profile";
const SELECTED_KEY = "selectedSidebarBtn";

function getSelectedActionOrDefault(): string {
  // return localStorage.getItem(SELECTED_KEY) ?? DEFAULT_ACTION;
  return sessionStorage.getItem(SELECTED_KEY) ?? DEFAULT_ACTION;
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


sidebarUlbtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    container.innerHTML = "";

    console.log("click");

    const action = btn.dataset.action!;
    // localStorage.setItem(SELECTED_KEY, action);
    sessionStorage.setItem(SELECTED_KEY, action);

    highlightButton(action);
    openSelectedData(action);
  });
});

async function openProfileData(): Promise<void> {
  try {
    const response = await fetch("/api/v1/users/my-info", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();

    // Determine profile image and username display based on admin status
    const profileImg = user.isAdmin
      ? "assets/img/makise.jpg"
      : "assets/img/default-profile1.png";
    const usernameDisplay = user.isAdmin
      ? `${user.username} (ADMIN)`
      : user.username;

    container.innerHTML = `
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

async function openProjectsAndEventsData(): Promise<void> {
  if (!container) {
    console.log("no container found");
    return;
  }

  // initSlideSkeletons();

  try {
    const slideshows: Slideshow[] = await fetchAllSlideShows();
    if (!slideshows[0]) {
      container.innerHTML = `
      <div>Empty Slideshows...</div>
      `;
    }

    const slidesDOM = slideshows
      .map((s) => {
        const imagesDOM = s.images
          .map((img, idx) => {
            return `
              <div
                class="slides fade"
                data-slide-id="${s.id}"
                data-slide-number="${idx + 1}"
                style="display: none;"
              >
                <div class="numbertext">${idx + 1} / ${s.images.length}</div>
                <img
                  src="${img.url}"
                  class="br-20"
                  style="height: 300px; width: 100%"
                />
              </div>
            `;
          })
          .join("");

        const dotsDOM = s.images
          .map((_, idx) => {
            return `<span class="dot" data-slideshow-id="${s.id}" data-dot-index="${idx + 1}"></span>`;
          })
          .join("");

        return `
            <div class="slideshow" data-slideshow-id="${s.id}">
              <p class="caption">${s.caption ? s.caption : ""}</p>
              <div
                class="slides-container"
                style="height: 300px; width: 300px;"
              >
                ${imagesDOM}
                <a class="prev" data-slideshow-id="${s.id}">&#10094;</a>
                <a class="next" data-slideshow-id="${s.id}">&#10095;</a>
              </div>
              <br />
              <div class="dots-container" style="text-align: center">
                ${dotsDOM}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    console.log({ slidesDOM });

    // if (!slideshows.length) {
    //   const container = document.querySelector(".container.events")!;
    //   container.insertAdjacentHTML(
    //     "beforeend",
    //     `
    //       <h1>Empty...</h1>
    //       </br>
    //       </br>
    //     `,
    //   );
    // }

    const slideshowsControls = document.createElement("div");
    slideshowsControls.classList.add(
      "slideshows-control-container",
      "border-subtle-effect",
    );
    const controlBtns = `
<div class="control-btn-container">
      <button class="p-1 br-15 btn-dark-accent edit control-btn">Edit</button>
      <button class="p-1 br-15 btn-outlined-dark-accent upload control-btn">Upload</button>
</div>`;
    slideshowsControls.innerHTML = controlBtns;

    const slideshowContainer = document.createElement("div");
    slideshowContainer.classList.add(
      "slideshow-container",
      "border-subtle-effect",
    );
    slideshowContainer.innerHTML = slidesDOM; // insert the data from db

    const projectsAndEventsContiner = document.createElement("div");
    projectsAndEventsContiner.classList.add(
      "projects-and-events-container",
      "container",
    );
    projectsAndEventsContiner.appendChild(slideshowsControls);
    projectsAndEventsContiner.appendChild(slideshowContainer);

    container.appendChild(projectsAndEventsContiner);

    await initSlideIndexesAndEvents();
  } catch (error) {
    console.error("Error in loadSlideshows:", error);
  }
}

// async function openProjectsAndEventsData(): Promise<void> {
//   try {
//     const response = await fetch("/api/v1/slides", {
//       method: "GET",
//       credentials: "include",
//     });
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const slideshows = (await response.json()) as Slideshow[];
//     container.innerHTML = `
//
//       <div class="container">
//         <table class="user-table ">
//           <thead>
//             <tr >
//               <th class="" style="width: 20%;">ID</th>
//               <th class="" style="width: 25%;">Caption</th>
//               <th class="" style="width: 35%;">Email</th>
//               <th class="" style="width: 20%;">Admin</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${users
//               .map(
//                 (
//                   user: {
//                     id: number | string;
//                     username: string;
//                     email: string;
//                     isAdmin: boolean;
//                   },
//                   i: number,
//                 ) => `
//             <tr>
//               <td style="${i === 0 ? "border-top: none;" : ""}">${user.id}</td>
//               <td style="${i === 0 ? "border-top: none;" : ""}">${user.username}</td>
//               <td style="${i === 0 ? "border-top: none;" : ""}">${user.email}</td>
//               <td style="${i === 0 ? "border-top: none;" : ""}">${user.isAdmin}</td>
//             </tr>
//             `,
//               )
//               .join("")}
//           </tbody>
//         </table>
//       </div>
//     `;
//   } catch (error) {
//     console.error("Error fetching users data:", error);
//   }
// }
const openBudgetAllocationData = () => {};

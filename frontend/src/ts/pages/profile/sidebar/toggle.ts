const showSidebarBtn = document.querySelector(
  ".profile-btn-show-sidebar",
) as HTMLElement;
const hideSidebarBtn = document.querySelector(
  ".sidebar-btn-hide-sidebar",
) as HTMLElement;
const sidebar = document.getElementById("sidebar");
const dataPage = document.documentElement.dataset.page;
const dom = document.documentElement;

// TOGGLING SIDEBAR
//
export const clearActiveSidebar = () => {
  const currentDataPage = document.documentElement.dataset.page;

  if (currentDataPage !== "profile") {
    sessionStorage.removeItem("active-sidebar");
  }
};

if (dataPage === "profile" && sessionStorage.getItem("active-sidebar")) {
  dom.classList.toggle("active-sidebar", true);
}

showSidebarBtn.addEventListener("click", () => {
  console.log("clicked sidebar toggle");
  if (dataPage && dataPage === "profile") {
    dom.classList.toggle("active-sidebar");
    sessionStorage.setItem("active-sidebar", "true");
  }
});

// <% if (user.isAdmin) { %>
// <button class="btn-dark-accent p-1 br-40" id="upload-trigger-btn">
//     Add Slideshow
// </button>
//
// <div class="upload-popup-overlay" id="upload-popup-overlay">
//     <div class="upload-popup">
//         <div class="popup-header">
//             <h2>Upload Images</h2>
//             <p>
//                 NOTE: <br />
//                 supported files: png, jpg, jpeg, webp<br />
//                 recommended 6-8 images only for storage
//                 considerations
//             </p>
//             <!-- <button id="close-upload-popup">&times;</button> -->
//         </div>
//
//         <form id="upload-form">
//             <div id="drop-zone">
//                 <p>Drop the file here or click to upload</p>
//                 <input
//                     type="file"
//                     id="image-upload"
//                     accept=".jpg,.jpeg,.png,.webp"
//                     multiple
//                     required
//                 />
//                 <div class="img-preview-container"></div>
//             </div>
//             <button type="submit">Upload</button>
//         </form>
//     </div>
// </div>
// <% } %>

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
    sessionStorage.removeItem("active-sidebar");
  }
});

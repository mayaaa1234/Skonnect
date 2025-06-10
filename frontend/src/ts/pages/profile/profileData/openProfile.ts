const container = document.getElementById("data-container") as HTMLElement;

export default async function openProfileData(): Promise<void> {
  try {
    const response = await fetch("/api/v1/users/my-info", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();

    const profileImg = user.isAdmin
      ? "assets/img/admin-profile.png"
      : "assets/img/default-profile1.png";
    const usernameDisplay = user.isAdmin
      ? `${user.username} (ADMIN)`
      : user.username;

    container.innerHTML = `
      <div class="profile-container container mt-4 dp-f fd-c ai-c gp-30">
        <div class="upper-container border-subtle-effect br-20 dp-f fd-c p-1">
          <div class="br-20 js-s upper-top p-1 dp-f ai-c jc-sb w-100">
            <h1 class="">Profile</h1>
            <!-- <button class="p-1 as-s br-40 btn-outlined-dark-accent test"> -->
            <!--   Edit profile -->
            <!-- </button> -->
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
        <div class="lower-container dp-f p-1 jc-sb ai-c br-20">
          <div></div>
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

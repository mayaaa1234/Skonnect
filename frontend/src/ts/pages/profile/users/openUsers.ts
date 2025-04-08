const container = document.getElementById("data-container") as HTMLElement;

export default async function openUsersData(): Promise<void> {
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
              <th class="" style="width: 30%;">Username</th>
              <th class="" style="width: 30%;">Email</th>
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
              <td class="ellipsis" style="${i === 0 ? "border-top: none;" : ""}">${user.username}</td>
              <td class="ellipsis" style="${i === 0 ? "border-top: none;" : ""}">${user.email}</td>
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

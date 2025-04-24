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
      <div class="container mt-4">
        <table border="1" cellspacing="0" class="user-table ">
          <thead class="">
            <tr class="ta-c">
              <th class="ta-c" style="width: 20%;">ID</th>
              <th class="ta-c" style="width: 30%;">Username</th>
              <th class="ta-c" style="width: 30%;">Email</th>
              <th class="ta-c" style="width: 20%;">Admin</th>
            </tr>
          </thead>
          <tbody class="ta-c">
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

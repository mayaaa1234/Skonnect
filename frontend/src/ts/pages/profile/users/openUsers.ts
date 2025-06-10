//
// const container = document.getElementById("data-container") as HTMLElement;
//
// export default async function openUsersData(): Promise<void> {
//   try {
//     const response = await fetch("/api/v1/users", {
//       method: "GET",
//       credentials: "include",
//     });
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const users = await response.json();
//     container.innerHTML = `
//       <div class="container mt-4">
//         <table border="1" cellspacing="0" class="user-table ">
//           <thead class="">
//             <tr class="ta-c">
//               <th class="ta-c" style="width: 20%;">ID</th>
//               <th class="ta-c" style="width: 30%;">Username</th>
//               <th class="ta-c" style="width: 30%;">Email</th>
//               <th class="ta-c" style="width: 20%;">Admin</th>
//             </tr>
//           </thead>
//           <tbody class="ta-c">
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
//               <td class="ellipsis" style="${i === 0 ? "border-top: none;" : ""}">${user.username}</td>
//               <td class="ellipsis" style="${i === 0 ? "border-top: none;" : ""}">${user.email}</td>
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
//
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
      <div class="container mt-4 users-container ">
        <div class="dp-f ai-c jc-c fd-c gp-10 w-auto"
style="width: 100%; max-width: 1000px; margin-inline: auto;"
        >
          <div
            class="as-fe dp-f jc-fe ai-c mb-2"
          >
            <input
              id="user-search-input"
              type="text"
              placeholder="Search user..."
              class="p-1 br-10"
              style="width: 250px; border: 1px solid var(--border-color);"
            />
          </div>

          <table border="1" cellspacing="0" class="user-table">
            <thead>
              <tr class="ta-c">
                <th class="ta-c" style="width: 20%;">ID</th>
                <th class="ta-c" style="width: 30%;">Username</th>
                <th class="ta-c" style="width: 30%;">Email</th>
                <th class="ta-c" style="width: 20%;">Admin</th>
              </tr>
            </thead>
            <tbody class="ta-c" id="user-table-body">
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
      </div>
    `;

    const searchInput = document.getElementById(
      "user-search-input",
    ) as HTMLInputElement;

    searchInput.addEventListener("input", () => {
      const value = searchInput.value.toLowerCase().trim();
      const rows = container.querySelectorAll<HTMLTableRowElement>(
        "#user-table-body tr",
      );

      rows.forEach((row) => {
        const text = row.textContent?.toLowerCase() || "";
        row.style.display = text.includes(value) ? "" : "none";
      });
    });
  } catch (error) {
    console.error("Error fetching users data:", error);
  }
}

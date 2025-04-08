import openUsersData from "./openUsers.ts";

export default async function initUsersPage() {
  await openUsersData();
}

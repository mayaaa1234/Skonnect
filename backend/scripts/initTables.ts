import createUsersTable from "./userTable.ts";
import createSlideShowTable from "./slideShowTable.ts";

const init = async () => {
  try {
    console.log("🚀 Initializing database...");

    await createUsersTable();
    await createSlideShowTable();
    process.exit();
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
};

init();

import { merge } from "webpack-merge";
import common from "./webpack.common.js"; // Ensure this imports the common configuration correctly

export default merge(common, {
  mode: "production", // production mode optimizes code
});

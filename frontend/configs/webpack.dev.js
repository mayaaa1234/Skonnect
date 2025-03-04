import process from "process";
import path from "path";
import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: 8080,
    static: path.resolve(process.cwd(), "frontend/public"),
    watchFiles: ["./frontend/views/*.hbs"],
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:3000",
        //changeOrigin: true, // Modifies the Host header
        //pathRewrite: { "^/api": "" },
      },
    ],
    allowedHosts: "all",
    historyApiFallback: true, // for single-page apps
    open: false,
    hot: true,
  },
});

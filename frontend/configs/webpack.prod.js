import { merge } from "webpack-merge";
import common from "./webpack.common.js";
//import TerserPlugin from "terser-webpack-plugin";

export default merge(common, {
  mode: "production",
  optimization: {
    minimize: true,
    //minimizer: new TerserPlugin({
    //  terserOptions: {
    //    keep_fnames: true,
    //    keep_classnames: true,
    //  },
    //}),

    //[new TerserPlugin()],
    //
    //splitChunks: {
    //  chunks: "all",
    //},
  },
});

import { merge } from "webpack-merge";
import subProd from "./webpack.subProd.js";
//import TerserPlugin from "terser-webpack-plugin";

export default merge(subProd, {
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

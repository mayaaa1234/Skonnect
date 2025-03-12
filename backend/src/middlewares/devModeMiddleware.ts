import path from "path";
import webpack from "webpack";
import devMiddleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import type { Application } from "express";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const webpackConfig = require(
  path.join(process.cwd(), "frontend", "configs", "webpack.dev.js"),
);

function dev(app: Application) {
  const compiler = webpack(webpackConfig.default);
  app.use(
    devMiddleware(compiler, {
      publicPath: webpackConfig.output?.publicPath,
      writeToDisk: true,
      //writeToDisk: false,
    }),
  );

  app.use(hotMiddleware(compiler));
}
export default dev;

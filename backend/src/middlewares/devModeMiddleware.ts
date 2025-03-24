import path from "path";
import process from "process";
import webpack from "webpack";
import devMiddleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import type { Application } from "express";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const webpackConfig = require(
  path.join(process.cwd(), "frontend", "configs", "webpack.dev.js"),
);

function devModeMiddleware(app: Application) {
  const compiler = webpack(webpackConfig.default);
  app.use(
    devMiddleware(compiler, {
      publicPath: webpackConfig.output?.publicPath,
      writeToDisk: true,
    }),
  );

  app.use(
    hotMiddleware(compiler, {
      log: console.log,
      heartbeat: 1000,
    }),
  );
}
export default devModeMiddleware;

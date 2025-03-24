import path from "path";
import process from "process";
import webpack from "webpack";
import devMiddleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import type { Application } from "express";

async function dev(app: Application) {
  const webpackConfig = (
    await import(
      path.join(process.cwd(), "frontend", "configs", "webpack.dev.js")
    )
  ).default;

  const compiler = webpack(webpackConfig);
  app.use(
    devMiddleware(compiler, {
      publicPath: webpackConfig.output?.publicPath,
      writeToDisk: true,
    }),
  );

  app.use(hotMiddleware(compiler));
}

export default dev;

/** @type {import('postcss-load-config').Config} */
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import purgecss from "@fullhuman/postcss-purgecss";
import cssnano from "cssnano";

export default {
  plugins: [
    autoprefixer,
    postcssNested,
    purgecss.default({
      content: [
        "./src/**/*.html",
        "./src/**/*.js",
        "./src/**/*.hbs",
        "./src/**/*.ts",
      ],
      safelist: [/^data-theme/],
    }),
    cssnano({
      preset: "default",
    }),
  ],
};

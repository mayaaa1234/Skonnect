/** @type {import('postcss-load-config').Config} */
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import purgecss from "@fullhuman/postcss-purgecss";
import cssnano from "cssnano";

export default {
  plugins: [
    autoprefixer,
    postcssNested,
    purgecss({
      content: ["frontend/views/**/*.ejs", "frontend/src/**/*.ts"],
      safelist: [/^data-theme/],
    }),
    cssnano({
      preset: "default",
    }),
  ],
};

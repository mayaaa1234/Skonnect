/** @type {import('postcss-load-config').Config} */
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import purgecssModule from "@fullhuman/postcss-purgecss";
import cssnano from "cssnano";

const purgecss = purgecssModule.default || purgecssModule;

export default {
  plugins: [
    autoprefixer,
    postcssNested,
    purgecss({
      content: ["frontend/views/**/*.ejs", "frontend/src/**/*.ts"],
      //safelist: [/^data-theme/],
      safelist: {
        standard: [/data-theme/],
        deep: [/data-theme/],
        greedy: [/data-theme/],
      },
    }),
    cssnano({
      preset: "default",
    }),
  ],
};

import path from "path";
import process from "process";
//import { glob } from "glob";
//import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
export default {
  entry: {
    app: "./frontend/src/main.ts",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(process.cwd(), "frontend/dist"),
    clean: true,
    assetModuleFilename: "assets/[hash][ext][query]",
    //publicPath: "/",
  },

  watchOptions: {
    ignored: ["node_modules", "backend"],
  },

  resolve: {
    extensions: [".scss", ".tsx", ".jsx", ".ts", ".js", ".hbs"], // no need to to add file ext when importing
  },

  stats: {
    loggingDebug: ["sass-loader"], // logs @debugs and types into console
  },

  plugins: [
    //new HtmlWebpackPlugin({
    //  template: "./src/views/tmux.hbs",
    //  filename: "tmux.html",
    //}),
    //
    //new HtmlWebpackPlugin({
    //  template: "./src/views/hyprland.hbs",
    //  filename: "hyprland.html",
    //}),
    //
    //new HtmlWebpackPlugin{
    //  template: "./src/views/nvim.hbs",
    //  filename: "nvim.html",
    //}),
    //
    //new HtmlWebpackPlugin({
    //  template: "./src/views/index.hbs",
    //  filename: "index.html",
    //}),
    //
    //new MiniCssExtractPlugin({
    //  filename: "[name].css",
    //}),

    new ESLintPlugin({
      configType: "flat",
      //overrideConfigFile: path.resolve(__dirname, "eslint.config.mjs"),
    }),

    //new FaviconsWebpackPlugin({
    //  logo: "./src/assets/logo.png",
    //  mode: "webapp",
    //  devMode: "light",
    //  outputPath: "assets/favicons",
    //  prefix: "assets/favicons/",
    //  favicons: {
    //    appName: "My App",
    //    appDescription: "My App Description",
    //    developerName: "Developer Name",
    //    developerURL: null,
    //    background: "#fff",
    //    theme_color: "#fff",
    //    appleStartup: false,
    //    icons: {
    //      android: [192, 512],
    //      appleIcon: [180, 192],
    //      favicons: [64, 128, 256],
    //      windows: false,
    //      yandex: false,
    //      coast: false,
    //    },
    //  },
    //}),

    new ForkTsCheckerWebpackPlugin(),
    //new NodePolyfillPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource", // handle as static assets
      },

      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
            // make all svg images to work in IE
            iesafe: true,
          },
        },
      },

      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        options: {
          partialDirs: [path.join(process.cwd(), "src/views/partials")],
          inlineRequires: /(?:png|jpg|jpeg|svg)$/,
        },
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        //use: ["style-loader", "css-loader"],
      },

      {
        test: /\.scss$/i,
        //use: ["style-loader", "css-loader", "sass-loader"],
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },

      {
        test: /\.([cm]?ts|tsx)$/,
        use: {
          loader: "ts-loader",
          options: {
            // speeds up build by skipping type checking
            transpileOnly: true,
            compilerOptions: {
              sourceMap: true,
            },
          },
        },
        //exclude: [/node_modules/, /backend/],
      },
    ],
  },
};

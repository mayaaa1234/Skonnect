import path from "path";
import webpack from "webpack";
import process from "process";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const config = {
  entry: {
    app: [
      "webpack-hot-middleware/client?reload=true&timeout=2000",
      "./frontend/src/webpack-entry.ts",
    ],
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(process.cwd(), "frontend/public"),
    //assetModuleFilename: "assets/[hash][ext][query]",
    clean: true,
    publicPath: "/",
  },

  watchOptions: {
    aggregateTimeout: 200,
    ignored: ["node_modules"],
  },

  resolve: {
    extensions: [".scss", ".tsx", ".jsx", ".ts", ".js", ".hbs"],
  },

  stats: {
    loggingDebug: ["sass-loader"],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new ESLintPlugin({
      configType: "flat",
      // You can specify an override file if needed:
      // overrideConfigFile: path.resolve(__dirname, "eslint.config.mjs"),
    }),
    // new NodePolyfillPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), "frontend/src/assets"),
          to: "assets/",
        },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(webp|png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
            iesafe: true,
          },
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: path.resolve(
                  process.cwd(),
                  "./frontend/configs/postcss.config.js",
                ),
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.[cm]?[jt]sx?$/, // Matches .js, .ts, .jsx, .tsx
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: [
              ["@babel/plugin-transform-runtime"], // Avoids regenerator issues
              [
                "module-resolver",
                {
                  extensions: [".js", ".ts"],
                  alias: {
                    "@": "./frontend/src", // Example alias
                  },
                },
              ],
            ],
          },
        },
      },
      //{
      //  test: /\.([cm]?ts|tsx)$/,
      //  use: {
      //    loader: "ts-loader",
      //    options: {
      //      configFile: path.resolve(
      //        process.cwd(),
      //        "frontend/configs/tsconfig.json",
      //      ),
      //      // uncomment the line below to skip type checking for faster builds
      //      transpileOnly: true,
      //      compilerOptions: {
      //        sourceMap: true,
      //      },
      //    },
      //  },
      //  exclude: [/node_modules/, /backend/],
      //},
    ],
  },
};

export default config;

import path from "path";
import process from "process";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const config = {
  entry: {
    app: "./frontend/src/webpack-entry.ts",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(process.cwd(), "frontend/public/dist"),
    assetModuleFilename: "assets/[hash][ext][query]",
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
    // Uncomment and configure if you need to copy assets
    // new CopyWebpackPlugin({
    //   patterns: [{ from: "frontend/src/images", to: "assets" }],
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new ESLintPlugin({
      configType: "flat",
      // You can specify an override file if needed:
      // overrideConfigFile: path.resolve(__dirname, "eslint.config.mjs"),
    }),
    // Uncomment if you need Node polyfills:
    // new NodePolyfillPlugin(),
    // Optionally, add HtmlWebpackPlugin if you generate an HTML file:
    // new HtmlWebpackPlugin({ template: "./frontend/src/index.html" }),
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
        test: /\.([cm]?ts|tsx)$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(
              process.cwd(),
              "frontend/configs/tsconfig.json",
            ),
            // Uncomment the line below to skip type checking for faster builds
            // transpileOnly: true,
            compilerOptions: {
              sourceMap: true,
            },
          },
        },
        exclude: [/node_modules/, /backend/],
      },
    ],
  },
};

export default config;

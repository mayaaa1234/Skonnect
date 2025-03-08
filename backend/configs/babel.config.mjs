export default {
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".js", ".ts"],
        alias: {},
        resolvePath: (sourcePath) => {
          return sourcePath.replace(/\.ts$/, ".js");
        },
      },
    ],
  ],
};

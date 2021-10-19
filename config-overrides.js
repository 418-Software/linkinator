const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

// Adds a manifest file to the build according to the current context,
// and deletes files from the build that are not needed in the current context
// const getFileManagerPlugin = () => {
//   const extensionBuildFiles = ["icon16.png", "icon48.png", "icon128.png", "index.html"];

//   const manifestFiles = {
//     extension: "build/manifest.json",
//   };

//   return new FileManagerPlugin({
//     events: {
//       onEnd: {
//         copy: [
//           {
//             source: manifestFiles.extension,
//             destination: "build/manifest.json",
//           },
//         ],
//       },
//     },
//   });
// };

module.exports = {
  webpack: function (config) {
    // Disable bundle splitting,
    // a single bundle file has to loaded as `content_script`.
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };

    // Enable debug
    // config.devtool = "inline-source-map";

    // `false`: each entry chunk embeds runtime.
    // The extension is built with a single entry including all JS.
    // https://symfonycasts.com/screencast/webpack-encore/single-runtime-chunk
    config.optimization.runtimeChunk = false;

    config.entry = {
      // web extension
      main: "./src/index.tsx",
      // background script that has to be referenced in the extension manifest
      // background: "./src/background/index.ts",
    };

    // Filenames of bundles must not include `[contenthash]`, so that they can be referenced in `extension-manifest.json`.
    // The `[name]` is taken from `config.entry` properties, so if we have `main` and `background` as properties, we get 2 output files - main.js and background.js.
    config.output.filename = "[name].js";

    // `MiniCssExtractPlugin` is used by the default CRA webpack configuration for
    // extracting CSS into separate files. The plugin has to be removed because it
    // uses `[contenthash]` in filenames of the separate CSS files.
    config.plugins = config.plugins
      .filter((plugin) => !(plugin instanceof MiniCssExtractPlugin))
      .concat(
        // `MiniCssExtractPlugin` is used with its default config instead,
        // which doesn't contain `[contenthash]`.
        new MiniCssExtractPlugin(),
        // getFileManagerPlugin()
      );

    return config;
  },
};

const path = require("path");

module.exports = [
  {
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 9000,
    },
    entry: "./app.scss",
    mode: "development",
    output: {
      filename: "style-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "bundle.css",
              },
            },
            { loader: "extract-loader" },
            { loader: "css-loader" },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                webpackImporter: false,
              },
            },
          ],
        },
      ],
    },
  },
];

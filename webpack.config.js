const { postcss } = require("autoprefixer");
const autoprefixer = require("autoprefixer");
const path = require("path");

function tryResolve_(url, sourceFilename) {
  // Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
  // when the importer throws
  try {
    return require.resolve(url, { paths: [path.dirname(sourceFilename)] });
  } catch (e) {
    return "";
  }
}

function tryResolveScss(url, sourceFilename) {
  // Support omission of .scss and leading _
  const normalizedUrl = url.endsWith(".scss") ? url : `${url}.scss`;
  return (
    tryResolve_(normalizedUrl, sourceFilename) ||
    tryResolve_(
      path.join(
        path.dirname(normalizedUrl),
        `_${path.basename(normalizedUrl)}`
      ),
      sourceFilename
    )
  );
}

function materialImporter(url, prev) {
  if (url.startsWith("@material")) {
    const resolved = tryResolveScss(url, prev);
    return { file: resolved || url };
  }
  return { file: url };
}

module.exports = [
  {
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 9000,
    },
    entry: ["./app.scss", "./app.js"],
    mode: "development",
    output: {
      filename: "bundle.js",
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
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [autoprefixer()],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                webpackImporter: false,
                sassOptions: {
                  importer: materialImporter,
                  includePaths: ["./node_modules"],
                },
              },
            },
          ],
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      ],
    },
  },
];

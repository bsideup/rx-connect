var path = require("path");

var config = {
  externals: [
    'react',
    'rx',
    'rx/dist/rx.lite',
    'rxjs',
    'rxjs/Rx',
  ],
  output: {
    library: "RxConnect",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: path.join(__dirname, "node_modules")
      },
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: path.join(__dirname, "node_modules")
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
      ],
    extensions: [".js"]
  }
};

module.exports = config;

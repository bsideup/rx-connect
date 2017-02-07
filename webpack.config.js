var path = require("path");

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

var rxExternal = {
  root: 'Rx',
  commonjs2: 'rx',
  commonjs: 'rx',
  amd: 'rx'
}

var rxjsExternal = {
  root: 'RxJS',
  commonjs2: 'rxjs',
  commonjs: 'rxjs',
  amd: 'rxjs'
}

var config = {
  externals: {
    'react': reactExternal,
    'rx': rxExternal,
    'rxjs': rxjsExternal
  },
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

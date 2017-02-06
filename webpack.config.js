var webpack = require("webpack");
var path = require("path");

var env = process.env.NODE_ENV

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
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: /(node_modules)/
      },
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve("./src"),
    extensions: ["", ".js"]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env)
    })
  ]
};

if (env === "production") {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config;

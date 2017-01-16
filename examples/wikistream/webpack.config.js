const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const targetPath = path.join(__dirname, "dist");

module.exports = {
    devtool: "source-map",
    node: {
        __filename: true,
        __dirname: true
    },
    entry: path.join(__dirname, "src", "index.js"),
    output: {
        path: targetPath,
        filename: "[name]-[hash].js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["react", "es2015", "stage-0"],
                    plugins: ["transform-decorators-legacy"]
                }
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf$|\.eot/,
                loader: "file"
            }
        ]
    },
    resolve: {
        alias: {
            "rx-connect": path.join(__dirname, '..', '..', 'src')
        },
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
            inject: "body"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    devServer: {
        port: 3000,
        inline: true,
        contentBase: targetPath,
        historyApiFallback: true
    }
};

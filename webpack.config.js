const join = require("path").join;
const fs = require("fs");

const dir = (...path) => join(__dirname, ...path);
const consoleDir = (...path) => dir("app", "console", ...path);
const browserDir = (...path) => dir("app", "browser", ...path);

const nodeModules = fs.readdirSync("node_modules")
    .filter(dir => dir !== ".bin")
    .reduce((acc, module) => Object.assign(acc, { [module]: "commonjs " + module }), {});

const consoleApp = {
    entry: consoleDir("index.js"),
    target: "node",
    externals: nodeModules,
    output: {
        path: consoleDir("build"),
        filename: "app.console.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
};

const browserApp = {
    entry: browserDir("src/index.js"),
    output: {
        path: browserDir("build"),
        publicPath: "/build/",
        filename: "app.browser.js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }]
    }
};

module.exports = [
    browserApp,
    consoleApp
];
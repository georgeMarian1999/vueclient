const paths = require('./paths')
const config = require('../config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')
const path = require("path");
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const env = require("../config/dev.env");

console.log(paths.static);

module.exports = merge(common, {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    // Enable: It is possible testing in IE 11, but reload / replacement will break due to a bug in webpack 5 !
    // Disable: It is possible to use hot relad / replacement but not using IE 11 !
    // target: ['web', 'es5'],

    // Spin up a server for quick development
    devServer : {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
            ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        proxy: config.dev.proxyTable,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
    },

    plugins: [

        new webpack.DefinePlugin({
            'process.env': env
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: paths.static+ '/index.html',
            inject: true
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.static,
                    to: config.dev.assetsSubDirectory,
                    globOptions: {
                        ignore: ['.*'],
                    },
                },
            ]
        }),

        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),
    ],
})

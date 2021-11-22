const paths = require('./paths')
const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')
const utils = require('./utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const config = require('../config');
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = require('../config/prod.env')

module.exports = merge(common, {
    mode: 'production',
    devtool: false,

    output: {
        path: paths.build,
        publicPath: config.build.assetsPublicPath,
        filename: utils.assetsPath('js/[name].[contenthash].bundle.js'),
    },


    // Production: Magic happen here transpiling to es5 to partly support older browser like IE11
    target: ['web', 'es5'],

    plugins: [
        // Extracts CSS into separate files
        // Note: style-loader is for development, MiniCssExtractPlugin is for production
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: '[id].css',
        }),

        new webpack.DefinePlugin({
            'process.env': env
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.static,
                    to: config.build.staticDirectory,
                    globOptions: {
                        ignore: ['.*'],
                    },
                },
            ]
        }),



        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: paths.static + '/index.html',
            favicon:  paths.static + '/favicon.png',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            // chunksSortMode: 'auto'
        }),

    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },

                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                path.resolve(__dirname, '../src/assets/styles/scss/globalImports.scss')
                            ]
                        }
                    }
                    ]
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), "..."],
        // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
        // instead of having their own. This also helps with long-term caching, since the chunks will only
        // change when actual code changes, not the webpack runtime.
        runtimeChunk: {
            name: 'runtime',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
})

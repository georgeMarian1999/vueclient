const paths = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require("webpack");
const path = require("path");

module.exports = {
    // Where webpack looks to start building the bundle
    entry: [ 'whatwg-fetch', paths.src + '/main.js'],


    resolve:{   extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': paths.src,
        }
    },


    // Where webpack outputs the assets and bundles
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/',
    },


    // Customize the webpack build process
    plugins: [


        //new webpack.DefinePlugin()
        // Vue plugin for the magic
        new VueLoaderPlugin(),

        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),

        // Copies files from target to destination folder
    ],

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            {test: /\.vue$/, loader: 'vue-loader' },
            {test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']},

            // Styles: Inject CSS into the head with source maps
            {
                test: /\.(scss|css)$/,
                use: [
                    // Note: Only style-loader works for me !!!
                    // 'vue-style-loader',
                    'style-loader',
                    {loader: 'css-loader', options: {sourceMap: true, importLoaders: 1}},
                    {loader: 'postcss-loader', options: {sourceMap: true}},
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
                ],
            },

            // Images: Copy image files to build folder
            {test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource'},

            // Fonts and SVGs: Inline files
            {test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline'},
        ],
    },
}

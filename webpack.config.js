/* eslint-disable strict, no-console, object-shorthand, prefer-template */
/* eslint-disable import/no-extraneous-dependencies, import/newline-after-import */
'use strict';

const path = require('path');
const removeTrailingSlash = require('remove-trailing-slash');

const webpack = require('webpack');
const autoPrefixer = require('autoprefixer');
const combineLoaders = require('webpack-combine-loaders');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').load({ silent: true });

const PRODUCTION = process.env.NODE_ENV === 'production';

const PATHS = {
    APP: path.resolve(__dirname, 'js/app.js'),
    BUILD: path.resolve(__dirname, 'build'),
    DIST: path.resolve(__dirname, 'dist'),
    NODE_MODULES: path.resolve(__dirname, 'node_modules'),
};


/** EXTERNAL DEFINITIONS INJECTED INTO APP **/
const DEFINITIONS = {
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),

        APP_VERSION: JSON.stringify(process.env.ONION_APP_VERSION || 'dev'),

        API_URL: JSON.stringify(
            removeTrailingSlash(process.env.ONION_API_URL || 'https://staging.ascribe.io/api')
        ),
        APP_BASE_PATH: JSON.stringify(
            removeTrailingSlash(process.env.ONION_BASE_PATH || '')
        ),
        SERVER_URL: JSON.stringify(
            removeTrailingSlash(process.env.ONION_SERVER_URL || 'https://staging.ascribe.io')
        ),

        RAVEN_DSN_URL: JSON.stringify(process.env.RAVEN_DSN_URL || ''),

        S3_ACCESS_KEY: JSON.stringify(process.env.S3_ACCESS_KEY || ''),
    },
};


/** PLUGINS **/
const PLUGINS = [
    new webpack.DefinePlugin(DEFINITIONS),
    new webpack.NoErrorsPlugin(),

    // Handle any dependencies that don't play nicely with System.import resolution
    new CopyWebpackPlugin([
        {
            from: path.resolve(PATHS.NODE_MODULES, 'audiojs/audiojs'),
            to: 'third_party/audiojs'
        },
    ]),

    // Extract stylesheets out of bundle
    new ExtractTextPlugin(
        PRODUCTION ? 'css/styles.min.css' : 'css/styles.css', {
            allChunks: true
        }
    ),

    // Generate index.html for app with link and style tags addded
    new HtmlWebpackPlugin({
        filename: 'index.html',
        minify: PRODUCTION ? {
            collapseWhitespace: true,
            minifyJS: true,
            removeComments: true,
            removeRedundantAttributes: true
        } : false,
        template: path.resolve(__dirname, 'index_template.html'),
    }),
];

const PROD_PLUGINS = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        output: {
            comments: false
        }
    }),
    new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true
    }),
];

if (PRODUCTION) {
    PLUGINS.push(...PROD_PLUGINS);
}


/** LOADERS **/
const JS_LOADER = combineLoaders([
    {
        loader: 'babel',
        query: {
            cacheDirectory: true,
        },
    },
]);

const CSS_LOADER = combineLoaders([
    {
        loader: 'css',
        query: {
            sourceMap: true,
        },
    },
    { loader: 'postcss' },
]);

const SASS_LOADER = `${CSS_LOADER}!` + combineLoaders([
    {
        loader: 'sass',
        query: {
            precision: '8', // See https://github.com/twbs/bootstrap-sass#sass-number-precision
            outputStyle: 'expanded',
            sourceMap: true,
        },
    }
]);

const URL_FONT_LOADER = combineLoaders([
    {
        loader: 'url',
        query: {
            limit: 10000,
            name: 'fonts/[name].[ext]',
        },
    },
]);

const FILE_FONT_LOADER = combineLoaders([
    {
        loader: 'file',
        query: {
            name: 'fonts/[name].[ext]',
        },
    },
]);

const LOADERS = [
    {
        test: /\.jsx?$/,
        exclude: [PATHS.NODE_MODULES],
        loader: JS_LOADER,
    },
    {
        test: /\.s[ac]ss$/,
        exclude: [PATHS.NODE_MODULES],
        loader: ExtractTextPlugin.extract('style', SASS_LOADER),
    },

    // Dependencies
    // Shmui
    {
        test: /\.css$/,
        include: [path.resolve(PATHS.NODE_MODULES, 'shmui')],
        loader: `style!${CSS_LOADER}`,
    },

    // Fonts
    // woffs and svgs are typically smaller should we can try to load them as a url
    {
        test: /\.(woff2?|svg)$/,
        loader: URL_FONT_LOADER,
    },
    {
        test: /\.(ttf|eot)$/,
        loader: FILE_FONT_LOADER,
    },
];


/** EXPORTED WEBPACK CONFIG **/
const config = {
    entry: ['bootstrap-loader/extractStyles', PATHS.APP],

    output: {
        filename: PRODUCTION ? 'js/bundle.min.js' : 'js/bundle.js',
        path: PRODUCTION ? PATHS.DIST : PATHS.BUILD,
        publicPath: '/static/',
    },

    debug: !PRODUCTION,

    devtool: PRODUCTION ? '#source-map' : '#inline-source-map',

    resolve: {
        extensions: ['', '.js', '.jsx'],
        modules: ['node_modules'], // Don't use absolute path here to allow recursive matching
    },

    plugins: PLUGINS,

    module: {
        loaders: LOADERS,
    },

    postcss: [autoPrefixer()],
};

module.exports = config;

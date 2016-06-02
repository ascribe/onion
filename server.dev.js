/* eslint-disable strict, no-console */
/* eslint-disable import/no-extraneous-dependencies, import/newline-after-import */
'use strict';

const path = require('path');
const removeTrailingSlash = require('remove-trailing-slash');

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config.js');

require('dotenv').load({ silent: true });

const HOST = process.env.ONION_DEV_HOST || 'localhost';
const PORT = process.env.ONION_DEV_PORT || 3000;
const BASE_PATH = removeTrailingSlash(process.env.ONION_BASE_PATH || '/');

// Enable server hot reloading
// React hot reloading is enabled through .babelrc and babel-react-transform
config.entry.unshift(`webpack-dev-server/client?http://${HOST}:${PORT}/`,
                     'webpack/hot/dev-server');
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// Specify output location for bundled files
config.output.publicPath = '/static/';

// Configure server
const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    contentBase: './build',
    historyApiFallback: {
        index: config.output.publicPath
    },
    hot: true,
    stats: { colors: true }
});

// Start server
server.listen(PORT, HOST, (err) => {
    if (err) {
        console.error(`Onion dev server ran into ${err} while starting on ${HOST}:${PORT} ` +
                      `with basePath set to ${BASE_PATH || '/'}. Shutting down...`);
        server.close();
    }
    console.log(`Onion server running on ${HOST}:${PORT} with basePath set to ${BASE_PATH || '/'}.`);
});

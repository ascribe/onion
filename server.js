/* eslint-disable strict, no-console */
'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const removeTrailingSlash = require('remove-trailing-slash');

const BASE_PATH = removeTrailingSlash(process.env.ONION_BASE_PATH || '/');
const PORT = process.env.ONION_PORT || 4000;

const app = express();

app.use(compression());
app.use(path.resolve(BASE_PATH, '/static'), express.static(path.resolve(__dirname, 'dist')));

app.get(/.*/, (req, res) => {
    console.log('%s %s', req.method, req.path);
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});


if (require.main === module) {
    console.log(`Starting Onion server on port ${PORT} with basePath set to ${BASE_PATH || '/'}`);
    app.listen(PORT);
}

module.exports.app = app;

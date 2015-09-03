var webpack = require('webpack');


module.exports = {
    entry: './js/app.js',
    target: 'web',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel' 
        }]
    }
};


'use strict';

const config = require('./config'); //eslint-disable-line no-unused-vars
const colors = require('colors');
const sauceConnectLauncher = require('sauce-connect-launcher');


function connect() {
    console.log(colors.yellow('Setting up tunnel from Saucelabs to your lovely computer, will take a while.'));
    // Creating the tunnel takes a bit of time. For this case we can safely disable Mocha timeouts.

    sauceConnectLauncher(function (err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(colors.green('Connected! Keep this process running and execute your tests.'));
    });
}

if (require.main === module) {
    connect();
}

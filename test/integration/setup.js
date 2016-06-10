'use strict';

const colors = require('colors');
const sauceConnectLauncher = require('sauce-connect-launcher');
const config = require('./config');


let globalSauceProcess;

if (!process.env.SAUCE_USERNAME) {
    console.log(colors.red('SAUCE_USERNAME is missing. Please check the README.md file.'));
    process.exit(1);
}

if (!process.env.SAUCE_ACCESS_KEY) {
    console.log(colors.red('SAUCE_ACCESS_KEY is missing. Please check the README.md file.'));
    process.exit(1);
}


if (process.env.SAUCE_AUTO_CONNECT) {
    before(function (done) {
        console.log(colors.yellow('Setting up tunnel from Saucelabs to your lovely computer, will take a while.'));
        // Creating the tunnel takes a bit of time. For this case we can safely disable Mocha timeouts.
        this.timeout(0);

        sauceConnectLauncher(function (err, sauceConnectProcess) {
            if (err) {
                console.error(err.message);
                return;
            }
            globalSauceProcess = sauceConnectProcess;
            done();
        });
    });


    after(function (done) {
        // Creating the tunnel takes a bit of time. For this case we can safely disable it.
        this.timeout(0);

        if (globalSauceProcess) {
            globalSauceProcess.close(done);
        }
    });
} else if (config.APP_URL.match(/localhost/)) {
    console.log(colors.yellow(`You are running tests on ${config.APP_URL}, make sure you already have a tunnel running.`));
    console.log(colors.yellow('To create the tunnel, run:'));
    console.log(colors.yellow(' $ node test/tunnel.js'));
}

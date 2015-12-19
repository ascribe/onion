'use strict';

require('dotenv').load();

const sauceConnectLauncher = require('sauce-connect-launcher');
let globalSauceProcess;


if (process.env.SAUCE_AUTO_CONNECT) {
    before(function(done) {
        // Creating the tunnel takes a bit of time. For this case we can safely disable it.
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
}

'use strict';

const wd = require('wd');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('./config.js');
chai.use(chaiAsPromised);
chai.should();



function testSuite(browserName, version, platform) {
    describe(`[${browserName} ${version} ${platform}] Login logs users in`, function() {
        // Set timeout to zero so Mocha won't time out.
        this.timeout(0);
        let browser;

        before(function() {
            // No need to inject `username` or `access_key`, by default the constructor
            // looks up the values in `process.env.SAUCE_USERNAME` and `process.env.SAUCE_ACCESS_KEY`
            browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80);
            return browser.init({ browserName, version, platform });
        });

        beforeEach(function() {
            return browser.get(config.APP_URL + '/login');
        });

        after(function() {
            return browser.quit();
        });

        it('should contain "Log in" in the title', function() {
            return browser.title().should.become('Log in');
        });

    });
}

config.BROWSERS.map(x => testSuite(...x));

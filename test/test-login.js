'use strict';

const Q = require('q');
const wd = require('wd');
const asserters = wd.asserters;   // Commonly used asserters for async waits in the browser
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

            // Start the browser, go to /login, and wait for the react app to render
            return browser
                .configureHttp({ baseUrl: config.APP_URL })
                .init({ browserName, version, platform })
                .get('/login')
                .waitForElementByCss('.ascribe-default-app', asserters.isDisplayed, 10000)
                .catch(function (err) {
                    console.log('Failure -- unable to load app.');
                    console.log('Skipping tests for this browser...');
                    return Q.reject(err);
                });
        });

        after(function() {
            return browser.quit();
        });

        it('should contain "Log in" in the title', function() {
            return browser.
                waitForElementByCss('.ascribe-login-wrapper', asserters.isDisplayed, 2000)
                title().should.become('Log in');
        });
    });
}

config.BROWSERS.map(x => testSuite(...x));

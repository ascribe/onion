'use strict';

const wd = require('wd');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();


describe('Login logs users in', function() {
    let browser;

    before(function() {
        browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80,
                                        process.env.ONION_SAUCELABS_USER || 'ascribe',
                                        process.env.ONION_SAUCELABS_APIKEY || 'b072b4f2-6302-42f6-a25d-47162666ca66') 

                                        return browser.init({ browserName: 'chrome' });
    });

    beforeEach(function() {
        return browser.get('http://www.ascribe.ninja/app/login');
    });

    after(function() {
        return browser.quit();
    });

    it('should contain "Log in" in the title', function() {
        return browser.title().should.become('Log in');
    });

});


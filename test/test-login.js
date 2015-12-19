'use strict';

const wd = require('wd');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();


describe('Login logs users in', function() {
    this.timeout(0);
    let browser;

    before(function() {
        browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80);
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


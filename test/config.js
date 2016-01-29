'use strict';

require('dotenv').load();


// https://code.google.com/p/selenium/wiki/DesiredCapabilities
const BROWSERS = [
    'chrome,47,WINDOWS',
    'chrome,46,WINDOWS',
    'firefox,43,MAC',
    'internet explorer,10,VISTA'
];


module.exports = {
    BROWSERS: BROWSERS.map(x => x.split(',')),
    APP_URL: process.env.SAUCE_DEFAULT_URL || 'http://www.localhost.com:3000'
};

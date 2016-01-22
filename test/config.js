'use strict';


// https://code.google.com/p/selenium/wiki/DesiredCapabilities
const BROWSERS = [
    'chrome,47,WINDOWS',
    'chrome,46,WINDOWS',
    'firefox,43,MAC',
    'internet explorer,10,VISTA'
];

const APP_URL = process.env.APP_URL || 'http://www.localhost.com:3000';


module.exports.BROWSERS = BROWSERS.map(x => x.split(','));
module.exports.APP_URL = APP_URL;

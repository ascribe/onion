'use strict';

const environment = require('../../environment');
const TIMEOUTS = environment.TIMEOUTS;

/**
 * Suite of tests against Cyland specific routes
 */
gemini.suite('Cyland', (suite) => {
    suite
        .setCaptureElements('.ascribe-body')
        .before((actions) => {
            // This will be called before every nested suite begins
            actions.waitForElementToShow('.ascribe-app', TIMEOUTS.NORMAL);
        });

    gemini.suite('Landing', (landingSuite) => {
        landingSuite
            .setUrl('/')
            // Ignore Cyland's logo as it's a gif
            .ignoreElements('.cyland-landing img')
            .capture('landing', (actions) => {
                actions.waitForElementToShow('.cyland-landing img', TIMEOUTS.LONG);
            });
    });

    // TODO: add more tests for cyland specific pages after authentication
});

'use strict';

const environment = require('../../environment');
const TIMEOUTS = environment.TIMEOUTS;

/**
 * Suite of tests against lumenus specific routes
 */
gemini.suite('Lumenus', (suite) => {
    suite
        .setCaptureElements('.ascribe-body')
        .before((actions) => {
            // This will be called before every nested suite begins
            actions.waitForElementToShow('.ascribe-app', TIMEOUTS.NORMAL);
        });

    gemini.suite('Landing', (landingSuite) => {
        landingSuite
            .setUrl('/')
            .capture('landing', (actions) => {
                // Wait for the logo to appear
                actions.waitForElementToShow('.wp-landing-wrapper img', TIMEOUTS.LONG);
            });
    });

    // TODO: add more tests for market specific pages after authentication
});

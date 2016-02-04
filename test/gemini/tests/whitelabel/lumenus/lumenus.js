'use strict';

const gemini = require('gemini');
const environment = require('../../environment');
const TIMEOUTS = environment.TIMEOUTS;

/**
 * Suite of tests against lumenus specific routes
 */
gemini.suite('Lumenus', (suite) => {
    suite
        //TODO: maybe this should be changed to .ascribe-body once the PR that does this is merged
        .setCaptureElements('.ascribe-wallet-app')
        .before((actions, find) => {
            // This will be called before every nested suite begins
            actions.waitForElementToShow('.ascribe-wallet-app', TIMEOUTS.NORMAL);
        });

    gemini.suite('Landing', (landingSuite) => {
        landingSuite
            .setUrl('/')
            .capture('landing', (actions, find) => {
                // Wait for the logo to appear
                actions.waitForElementToShow('.wp-landing-wrapper img', TIMEOUTS.LONG);
            });
    });

    // TODO: add more tests for market specific pages after authentication
});

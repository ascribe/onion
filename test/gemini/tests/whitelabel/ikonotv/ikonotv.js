'use strict';

const gemini = require('gemini');
const environment = require('../../environment');

/**
 * Suite of tests against Cyland specific routes
 */
gemini.suite('Ikonotv', (suite) => {
    suite
        //TODO: maybe this should be changed to .ascribe-body once the PR that does this is merged
        .setCaptureElements('.ascribe-wallet-app')
        .before((actions, find) => {
            // This will be called before every nested suite begins
            actions.waitForElementToShow('.ascribe-wallet-app', 5000);
        });

    gemini.suite('Landing', (landingSuite) => {
        landingSuite
            .setUrl('/')
            // Gemini complains if we try to capture the entire app for Ikonotv's landing page for some reason
            .setCaptureElements('.ikonotv-landing')
            .setTolerance(5)
            .capture('landing', (actions, find) => {
                // Stop background animation
                actions.executeJS(function (window) {
                    var landingBackground = window.document.querySelector('.client--ikonotv .route--landing');
                    landingBackground.style.animation = 'none';
                    landingBackground.style.webkitAnimation = 'none';
                });

                // Wait for logo to appear
                actions.waitForElementToShow('.ikonotv-landing header img', 10000);
            });
    });

    // Ikono needs its own set of tests for some pre-authorization pages to wait for
    // its logo to appear
    gemini.suite('Ikonotv basic', (suite) => {
        suite
            .setCaptureElements('.ascribe-wallet-app')
            .before((actions, find) => {
                // This will be called before every nested suite begins unless that suite
                // also defines a `.before()`
                // FIXME: use a more generic class for this, like just '.app',
                // when we can use this file with the whitelabels
                actions.waitForElementToShow('.ascribe-wallet-app', 5000);

                // Wait for the forms to appear
                actions.waitForElementToShow('.ascribe-form', 5000);

                // Just use a dumb wait because the logo is set as a background image
                actions.wait(3000);
            });

        gemini.suite('Login', (loginSuite) => {
            loginSuite
                .setUrl('/login')
                .capture('login')
                .capture('hover on login submit', (actions, find) => {
                    actions.mouseMove(find('.ascribe-form button[type=submit]'));
                })
                .capture('hover on sign up link', (actions, find) => {
                    actions.mouseMove(find('.ascribe-login-text a[href="/signup"]'));
                })
                .capture('login form filled with focus', (actions, find) => {
                    const emailInput = find('.ascribe-form input[name=email]');

                    // Remove hover from sign up link
                    actions.click(emailInput);

                    actions.sendKeys(emailInput, environment.mainUser.email);
                    actions.sendKeys(find('.ascribe-form input[name=password]'), environment.mainUser.password);
                })
                .capture('login form filled', (actions, find) => {
                    actions.click(find('.ascribe-form-header'));
                });
        });

        gemini.suite('Sign up', (signUpSuite) => {
            signUpSuite
                .setUrl('/signup')
                .capture('sign up')
                .capture('sign up form filled with focus', (actions, find) => {
                    actions.sendKeys(find('.ascribe-form input[name=email]'), environment.mainUser.email);
                    actions.sendKeys(find('.ascribe-form input[name=password]'), environment.mainUser.password);
                    actions.sendKeys(find('.ascribe-form input[name=password_confirm]'), environment.mainUser.password);
                })
                .capture('sign up form filled with check', (actions, find) => {
                    actions.click(find('.ascribe-form input[type="checkbox"] ~ .checkbox'));
                });
        });
    });

    // TODO: add more tests for ikonotv specific pages after authentication
});

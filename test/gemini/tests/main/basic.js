'use strict';

const gemini = require('gemini');
const environment = require('../environment');
const MAIN_USER = environment.MAIN_USER;
const TIMEOUTS = environment.TIMEOUTS;

/**
 * Basic suite of tests against routes that do not require the user to be authenticated.
*/
gemini.suite('Basic', (suite) => {
    suite
        .setUrl('/login')
        .setCaptureElements('.ascribe-body')
        .before((actions, find) => {
            // This will be called before every nested suite begins unless that suite
            // also defines a `.before()`
            actions.waitForElementToShow('.ascribe-app', TIMEOUTS.NORMAL);
        });

    gemini.suite('Header-desktop', (headerSuite) => {
        headerSuite
            .setCaptureElements('nav.navbar .container')
            .skip(/Mobile/)
            .capture('desktop header', (actions, find) => {
                actions.waitForElementToShow('nav.navbar .container', TIMEOUTS.NORMAL);
            })
            .capture('hover on active item', (actions, find) => {
                const activeItem = find('nav.navbar li.active');
                actions.mouseMove(activeItem);
            })
            .capture('hover on inactive item', (actions, find) => {
                const inactiveItem = find('nav.navbar li:not(.active)');
                actions.mouseMove(inactiveItem);
            });
    });

    // Test for the collapsed header in mobile
    gemini.suite('Header-mobile', (headerMobileSuite) => {
        headerMobileSuite
            .setCaptureElements('nav.navbar .container')
            .skip(/Desktop/)
            .capture('mobile header', (actions, find) => {
                actions.waitForElementToShow('nav.navbar .container', TIMEOUTS.NORMAL);
            })
            .capture('expanded mobile header', (actions, find) => {
                actions.click(find('nav.navbar .navbar-toggle'));
                // Wait for the header to expand
                actions.wait(500);
            })
            .capture('hover on expanded mobile header item', (actions, find) => {
                actions.mouseMove(find('nav.navbar li'));
            });
    });

    gemini.suite('Footer', (footerSuite) => {
        footerSuite
            .setCaptureElements('.ascribe-footer')
            .capture('footer', (actions, find) => {
                actions.waitForElementToShow('.ascribe-footer', TIMEOUTS.NORMAL);
            })
            .capture('hover on footer item', (actions, find) => {
                const footerItem = find('.ascribe-footer a:not(.social)');
                actions.mouseMove(footerItem);
            })
            .capture('hover on footer social item', (actions, find) => {
                const footerSocialItem = find('.ascribe-footer a.social')
                actions.mouseMove(footerSocialItem);
            });
    });

    gemini.suite('Login', (loginSuite) => {
        loginSuite
            .capture('login', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', TIMEOUTS.NORMAL);
            })
            .capture('hover on login submit', (actions, find) => {
                actions.mouseMove(find('.ascribe-form button[type=submit]'));
            })
            .capture('login form filled with focus', (actions, find) => {
                const emailInput = find('.ascribe-form input[name=email]');

                // Remove hover from sign up link
                actions.click(emailInput);

                actions.sendKeys(emailInput, MAIN_USER.email);
                actions.sendKeys(find('.ascribe-form input[name=password]'), MAIN_USER.password);
            })
            .capture('login form filled', (actions, find) => {
                actions.click(find('.ascribe-form-header'));
            });
    });

    gemini.suite('Password reset', (passwordResetSuite) => {
        passwordResetSuite
            .setUrl('/password_reset')
            .capture('password reset', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', TIMEOUTS.NORMAL);
            })
            .capture('password reset form filled with focus', (actions, find) => {
                actions.sendKeys(find('.ascribe-form input[name="email"]'), MAIN_USER.email);
            })
            .capture('password reset form filled', (actions, find) => {
                actions.click(find('.ascribe-form-header'));
            });
    });

    gemini.suite('Coa verify', (coaVerifySuite) => {
        coaVerifySuite
            .setUrl('/coa_verify')
            .capture('coa verify', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', TIMEOUTS.NORMAL);
            })
            .capture('coa verify form filled with focus', (actions, find) => {
                actions.sendKeys(find('.ascribe-form input[name="message"]'), 'sample text');
                actions.sendKeys(find('.ascribe-form .ascribe-property-wrapper:nth-of-type(2) textarea'), 'sample signature');
            })
            .capture('coa verify form filled', (actions, find) => {
                actions.click(find('.ascribe-login-header'));
            });
    });

    gemini.suite('Not found', (notFoundSuite) => {
        notFoundSuite
            .setUrl('/not_found_page')
            .capture('not found page');
    });
});

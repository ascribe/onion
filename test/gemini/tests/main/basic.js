'use strict';

const gemini = require('gemini');

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
            // FIXME: use a more generic class for this, like just '.ascribe-app'
            actions.waitForElementToShow('.ascribe-default-app', 5000);
        });

    gemini.suite('Header-desktop', (headerSuite) => {
        headerSuite
            .setCaptureElements('nav.navbar .container')
            .skip(/Mobile/)
            .capture('desktop header', (actions, find) => {
                actions.waitForElementToShow('nav.navbar .container', 5000);
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
                actions.waitForElementToShow('nav.navbar .container', 5000);
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
                actions.waitForElementToShow('.ascribe-footer', 5000);
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
                actions.waitForElementToShow('.ascribe-form', 5000);
            })
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

                actions.sendKeys(emailInput, 'dimi@mailinator.com');
                actions.sendKeys(find('.ascribe-form input[name=password]'), '0000000000');
            })
            .capture('login form filled', (actions, find) => {
                actions.click(find('.ascribe-form-header'));
            });
    });

    gemini.suite('Sign up', (signUpSuite) => {
        signUpSuite
            .setUrl('/signup')
            .capture('sign up', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', 5000);
            })
            .capture('sign up form filled with focus', (actions, find) => {
                actions.sendKeys(find('.ascribe-form input[name=email]'), 'dimi@mailinator.com');
                actions.sendKeys(find('.ascribe-form input[name=password]'), '0000000000');
                actions.sendKeys(find('.ascribe-form input[name=password_confirm]'), '0000000000');
            })
            .capture('sign up form filled with check', (actions, find) => {
                actions.click(find('.ascribe-form input[type="checkbox"] ~ .checkbox'));
            });
    });

    gemini.suite('Password reset', (passwordResetSuite) => {
        passwordResetSuite
            .setUrl('/password_reset')
            .capture('password reset', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', 5000);
            })
            .capture('password reset form filled with focus', (actions, find) => {
                actions.sendKeys(find('.ascribe-form input[name="email"]'), 'dimi@mailinator.com');
            })
            .capture('password reset form filled', (actions, find) => {
                actions.click(find('.ascribe-form-header'));
            });
    });

    gemini.suite('Coa verify', (coaVerifySuite) => {
        coaVerifySuite
            .setUrl('/coa_verify')
            .capture('coa verify', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', 5000);
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

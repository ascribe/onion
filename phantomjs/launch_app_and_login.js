'use strict';

var liveEnv = 'https://www.ascribe.io/app/login';
// Note that if you are trying to access staging, you will need to use
// the --ignore-ssl-errors=true flag on phantomjs
var stagingEnv = 'https://www.ascribe.ninja/app/login';
var localEnv = 'http://localhost.com:3000/login';

var page = require('webpage').create();
page.open(localEnv, function(status) {
    var attemptedToLogIn;
    var loginCheckInterval;

    console.log('Status: ' + status);

    if (status === 'success') {
        console.log('Attempting to log in...');

        attemptedToLogIn = page.evaluate(function () {
            try {
                var inputForm = document.querySelector('.ascribe-login-wrapper');
                var email = inputForm.querySelector('input[type=email]');
                var password = inputForm.querySelector('input[type=password]');
                var submitBtn = inputForm.querySelector('button[type=submit]');

                email.value = 'dimi@mailinator.com';
                password.value = '0000000000';
                submitBtn.click();

                return true;
            } catch (ex) {
                console.log('Error while trying to find login elements, not logging in.');
                return false;
            }
        });

        if (attemptedToLogIn) {
            loginCheckInterval = setInterval(function () {
                var loggedIn = page.evaluate(function () {
                    // When they log in, they are taken to the collections page.
                    // When the piece list is loaded, the accordion list is either available or
                    // shows a placeholder, so let's check for these elements to determine
                    // when login is finished
                    return !!(document.querySelector('.ascribe-accordion-list:not(.ascribe-loading-position)') ||
                              document.querySelector('.ascribe-accordion-list-placeholder'));
                });

                if (loggedIn) {
                    clearInterval(loginCheckInterval);
                    console.log('Successfully logged in.');
                }
            }, 1000);
        } else {
            console.log('Something happened while trying to log in, aborting...');
            phantom.exit();
        }

    } else {
        console.log('Failed to load page, exiing...');
        phantom.exit();
    }
});

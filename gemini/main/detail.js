'use strict';

const gemini = require('gemini');
const pieceUrl = '/pieces/12374';
const editionUrl = '/editions/14gw9x3VA9oJaxp4cHaAuK2bvJzvEj4Xvc';

/**
 * Suite of tests against the piece and edition routes.
 * Tests include accessing the piece / edition as the owner or as another user
 * (we can just use an anonymous user in this case).
*/
gemini.suite('Work detail', (suite) => {
    suite
        .setCaptureElements('.ascribe-body')
        .before((actions, find) => {
            // This will be called before every nested suite begins unless that suite
            // also defines a `.before()`
            // FIXME: use a more generic class for this, like just '.app',
            // when we can use this file with the whitelabels
            actions.waitForElementToShow('.ascribe-default-app', 5000);

            // Wait for the social media buttons to appear
            actions.waitForElementToShow('.ascribe-social-button-list .fb-share-button iframe', 20000);
            actions.waitForElementToShow('.ascribe-social-button-list .twitter-share-button', 20000);
            actions.waitForElementToShow('.ascribe-media-player', 10000);
        });

    gemini.suite('Basic piece', (basicPieceSuite) => {
        basicPieceSuite
            .setUrl(pieceUrl)
            .capture('basic piece')
            .capture('shmui', (actions, find) => {
                actions.click(find('.ascribe-media-player'));
                actions.waitForElementToShow('.shmui-wrap:not(.loading)', 30000);
                // Wait for the transition to end
                actions.wait(1000);
            });
    });

    gemini.suite('Basic edition', (basicEditionSuite) => {
        basicEditionSuite
            .setUrl(editionUrl)
            .capture('basic edition');
    });

    // Suite just to log us in before any other suites run
    gemini.suite('Login', (loginSuite) => {
        loginSuite
            .setUrl('/login')
            .ignoreElements('.ascribe-body')
            .before((actions, find) => {
                actions.waitForElementToShow('.ascribe-default-app', 5000);
            })
            .capture('logged in', (actions, find) => {
                actions.sendKeys(find('.ascribe-login-wrapper input[name=email]'), 'dimi@mailinator.com');
                actions.sendKeys(find('.ascribe-login-wrapper input[name=password]'), '0000000000');
                actions.click(find('.ascribe-login-wrapper button[type=submit]'));

                actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', 5000);
            });
    });

    gemini.suite('Authorized piece', (authorizedPieceSuite) => {
        authorizedPieceSuite
            .setUrl(pieceUrl)
            .capture('authorized piece');
    });

    gemini.suite('Authorized edition', (authorizedEditionSuite) => {
        authorizedEditionSuite
            .setUrl(editionUrl)
            .capture('authorized edition')
    });

    gemini.suite('Detail action buttons', (detailActionButtonSuite) => {
        detailActionButtonSuite
            .setUrl(editionUrl)
            .capture('hover on action button', (actions, find) => {
                actions.mouseMove(find('.ascribe-detail-property .ascribe-button-list button.btn-default'));
            })
            .capture('hover on delete button', (actions, find) => {
                actions.mouseMove(find('.ascribe-detail-property .ascribe-button-list button.btn-tertiary'));
            })
            .capture('hover on info button', (actions, find) => {
                actions.mouseMove(find('.ascribe-detail-property .ascribe-button-list button.glyphicon-question-sign'));
            })
            .capture('expand info text', (actions, find) => {
                actions.click(find('.ascribe-detail-property .ascribe-button-list button.glyphicon-question-sign'));
            });
    });

    gemini.suite('Action form modal', (actionFormModalSuite) => {
        actionFormModalSuite
            .setUrl(editionUrl)
            .setCaptureElements('.modal-dialog')
            .capture('open email form', (actions, find) => {
                // Add class names to make the action buttons easier to select
                actions.executeJS(function (window) {
                    var actionButtons = window.document.querySelectorAll('.ascribe-detail-property .ascribe-button-list button.btn-default');
                    for (var ii = 0; ii < actionButtons.length; ++ii) {
                        if (actionButtons[ii].textContent) {
                            actionButtons[ii].className += ' ascribe-action-button-' + actionButtons[ii].textContent.toLowerCase();
                        }
                    }
                });
                actions.click(find('.ascribe-detail-property .ascribe-button-list button.ascribe-action-button-email'));

                // Wait for transition
                actions.wait(1000);
            });
    });

    // Suite just to log out after suites have run
    gemini.suite('Log out', (logoutSuite) => {
        logoutSuite
            .setUrl('/logout')
            .ignoreElements('.ascribe-body')
            .before((actions, find) => {
                actions.waitForElementToShow('.ascribe-default-app', 5000);
            })
            .capture('logout', (actions, find) => {
                actions.waitForElementToShow('.ascribe-login-wrapper', 10000);
            });
    });
});

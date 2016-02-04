'use strict';

const gemini = require('gemini');
const environment = require('../environment');
const MAIN_USER = environment.MAIN_USER;
const TIMEOUTS = environment.TIMEOUTS;

/**
 * Suite of tests against routes that require the user to be authenticated.
*/
gemini.suite('Authenticated', (suite) => {
    suite
        .setUrl('/collection')
        .setCaptureElements('.ascribe-body')
        .before((actions, find) => {
            // This will be called before every nested suite begins unless that suite
            // also defines a `.before()`
            // FIXME: use a more generic class for this, like just '.app',
            // when we can use this file with the whitelabels
            actions.waitForElementToShow('.ascribe-default-app', TIMEOUTS.NORMAL);
        });

    // Suite just to log us in before any other suites run
    gemini.suite('Login', (loginSuite) => {
        loginSuite
            .setUrl('/login')
            .ignoreElements('.ascribe-body')
            .capture('logged in', (actions, find) => {
                actions.waitForElementToShow('.ascribe-form', TIMEOUTS.NORMAL);

                actions.sendKeys(find('.ascribe-login-wrapper input[name=email]'), MAIN_USER.email);
                actions.sendKeys(find('.ascribe-login-wrapper input[name=password]'), MAIN_USER.password);
                actions.click(find('.ascribe-login-wrapper button[type=submit]'));

                actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', TIMEOUTS.NORMAL);
            });
    });

    gemini.suite('Header-desktop', (headerSuite) => {
        headerSuite
            .setCaptureElements('nav.navbar .container')
            // Ignore Cyland's logo as it's a gif
            .ignoreElements('.client--cyland img.img-brand')
            .skip(/Mobile/)
            .before((actions, find) => {
                actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', TIMEOUTS.NORMAL);
            })
            .capture('desktop header');

        gemini.suite('User dropdown', (headerUserSuite) => {
            headerUserSuite
                .setCaptureElements('#nav-route-user-dropdown ~ .dropdown-menu')
                .capture('expanded user dropdown', (actions, find) => {
                    actions.click(find('#nav-route-user-dropdown'));
                });
        });

        gemini.suite('Notification dropdown', (headerNotificationSuite) => {
            headerNotificationSuite
                .setCaptureElements('#header-notification-dropdown ~ .dropdown-menu')
                .capture('expanded notifications dropdown', (actions, find) => {
                    actions.click(find('#header-notification-dropdown'));
                });
        });
    });

    // Test for the collapsed header in mobile
    gemini.suite('Header-mobile', (headerMobileSuite) => {
        headerMobileSuite
            .setCaptureElements('nav.navbar .container')
            // Ignore Cyland's logo as it's a gif
            .ignoreElements('.client--cyland img.img-brand')
            .skip(/Desktop/)
            .before((actions, find) => {
                actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', TIMEOUTS.NORMAL);
            })
            .capture('mobile header')
            .capture('expanded mobile header', (actions, find) => {
                actions.click(find('nav.navbar .navbar-toggle'));
                // Wait for the header to expand
                actions.wait(500);
            })
            .capture('expanded user dropdown', (actions, find) => {
                actions.click(find('#nav-route-user-dropdown'));
            })
            .capture('expanded notifications dropdown', (actions, find) => {
                actions.click(find('#header-notification-dropdown'));
            });
    });

    gemini.suite('Collection', (collectionSuite) => {
        collectionSuite
            .setCaptureElements('.ascribe-accordion-list')
            .before((actions, find) => {
                actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', TIMEOUTS.NORMAL);
                // Wait for the images to load
                // FIXME: unfortuntately gemini doesn't support ignoring multiple elements from a single selector
                // so we're forced to wait and hope that the images will all finish loading after 5s.
                // We could also change the thumbnails with JS, but setting up a test user is probably easier.
                actions.wait(TIMEOUTS.NORMAL);
            })
            .capture('collection')
            .capture('expanded edition in collection', (actions, find) => {
                actions.click(find('.ascribe-accordion-list-item .ascribe-accordion-list-item-edition-widget'));
                // Wait for editions to load
                actions.waitForElementToShow('.ascribe-accordion-list-item-table', TIMEOUTS.LONG);
            })

        gemini.suite('Collection placeholder', (collectionPlaceholderSuite) => {
            collectionPlaceholderSuite
                .setCaptureElements('.ascribe-accordion-list-placeholder')
                .capture('collection empty search', (actions, find) => {
                    actions.sendKeys(find('.ascribe-piece-list-toolbar .search-bar input[type="text"]'), 'no search result');
                    actions.waitForElementToShow('.ascribe-accordion-list-placeholder', TIMEOUTS.NORMAL);
                });
        });

        gemini.suite('PieceListBulkModal', (pieceListBulkModalSuite) => {
            pieceListBulkModalSuite
                .setCaptureElements('.piece-list-bulk-modal')
                .capture('items selected', (actions, find) => {
                    actions.click(find('.ascribe-accordion-list-item .ascribe-accordion-list-item-edition-widget'));
                    // Wait for editions to load
                    actions.waitForElementToShow('.ascribe-accordion-list-item-table', TIMEOUTS.NORMAL);

                    actions.click('.ascribe-table thead tr input[type="checkbox"]');
                    actions.waitForElementToShow('.piece-list-bulk-modal');
                });
        });
    });

    gemini.suite('PieceListToolbar', (pieceListToolbarSuite) => {
        pieceListToolbarSuite
            .setCaptureElements('.ascribe-piece-list-toolbar')
            .capture('piece list toolbar')
            .capture('piece list toolbar search filled', (actions, find) => {
                actions.sendKeys(find('.ascribe-piece-list-toolbar .search-bar input[type="text"]'), 'search text');
                actions.waitForElementToShow('.ascribe-piece-list-toolbar .search-bar .icon-ascribe-search', TIMEOUTS.NORMAL);
            })

        gemini.suite('Order widget dropdown', (pieceListToolbarOrderWidgetSuite) => {
            pieceListToolbarOrderWidgetSuite
                .setCaptureElements('#ascribe-piece-list-toolbar-order-widget-dropdown',
                                    '#ascribe-piece-list-toolbar-order-widget-dropdown ~ .dropdown-menu')
                .capture('expanded order dropdown', (actions, find) => {
                    actions.click(find('#ascribe-piece-list-toolbar-order-widget-dropdown'));

                    // Wait as the dropdown screenshot still includes the collection in the background
                    actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', TIMEOUTS.NORMAL);
                });
        });

        gemini.suite('Filter widget dropdown', (pieceListToolbarFilterWidgetSuite) => {
            pieceListToolbarFilterWidgetSuite
                .setCaptureElements('#ascribe-piece-list-toolbar-filter-widget-dropdown',
                                    '#ascribe-piece-list-toolbar-filter-widget-dropdown ~ .dropdown-menu')
                .capture('expanded filter dropdown', (actions, find) => {
                    actions.click(find('#ascribe-piece-list-toolbar-filter-widget-dropdown'));

                    // Wait as the dropdown screenshot still includes the collection in the background
                    actions.waitForElementToShow('.ascribe-accordion-list:not(.ascribe-loading-position)', TIMEOUTS.NORMAL);
                });
        });
    });

    gemini.suite('Register work', (registerSuite) => {
        registerSuite
            .setUrl('/register_piece')
            .capture('register work', (actions, find) => {
                // The uploader options are only rendered after the user is fetched, so
                // we have to wait for it here
                actions.waitForElementToShow('.file-drag-and-drop-dialog .present-options', TIMEOUTS.NORMAL);
            })
            .capture('register work filled', (actions, find) => {
                actions.sendKeys(find('.ascribe-form input[name="artist_name"]'), 'artist name');
                actions.sendKeys(find('.ascribe-form input[name="title"]'), 'title');
                actions.sendKeys(find('.ascribe-form input[name="date_created"]'), 'date created');
            })
            .capture('register work filled with editions', (actions, find) => {
                actions.click(find('.ascribe-form input[type="checkbox"] ~ .checkbox'));
                actions.wait(500);
                actions.sendKeys(find('.ascribe-form input[name="num_editions"]'), '50');
            });

        gemini.suite('Register work hash', (registerHashSuite) => {
            registerHashSuite
                .setUrl('/register_piece?method=hash')
                .capture('register work hash method');
        });

        gemini.suite('Register work upload', (registerUploadSuite) => {
            registerUploadSuite
                .setUrl('/register_piece?method=upload')
                .capture('register work upload method');
        });
    });

    gemini.suite('User settings', (userSettingsSuite) => {
        userSettingsSuite
            .setUrl('/settings')
            .before((actions, find) => {
                // This will be called before every nested suite begins unless that suite
                // also defines a `.before()`
                actions.waitForElementToShow('.settings-container', TIMEOUTS.NORMAL);
            })
            .capture('user settings');
    });

    // Suite just to log out after suites have run
    gemini.suite('Log out', (logoutSuite) => {
        logoutSuite
            .setUrl('/logout')
            .ignoreElements('.ascribe-body')
            .capture('logout', (actions, find) => {
                actions.waitForElementToShow('.ascribe-login-wrapper', TIMEOUTS.LONG);
            });
    });
});

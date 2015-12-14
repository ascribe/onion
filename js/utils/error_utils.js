'use strict';

import Raven from 'raven-js';

import AppConstants from '../constants/application_constants';


/**
 * Logs an error in to the console but also sends it to
 * Sentry.
 * Optionally, a comment can be defined.
 * @param  {Error} error    a Javascript error
 * @param  {boolean} ignoreSentry Defines whether or not the error should be submitted to Sentry
 * @param  {string} comment  Will also be submitted to Sentry, but will not be logged
 */
function logGlobal(error, comment, ignoreSentry = AppConstants.errorMessagesToIgnore.indexOf(error.message) > -1) {
    console.error(error);

    if(!ignoreSentry) {
        if(comment) {
            Raven.captureException(error, {extra: { comment }});
        } else {
            Raven.captureException(error);
        }
    }
}

export function initLogging() {
    // Initialize Raven for logging on Sentry
    Raven.config(AppConstants.raven.url, {
        release: AppConstants.version
    }).install();

    window.onerror = Raven.process;

    console.logGlobal = logGlobal;
}

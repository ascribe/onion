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

/*
 * Gets the json errors from the error as an array
 * @param  {Error} error A Javascript error
 * @return {Array}       List of json errors
 */
export function getJsonErrorsAsArray(error) {
    const { json: { errors = {} } = {} } = error;

    const errorArrays = Object
        .keys(errors)
        .map((errorKey) => {
            return errors[errorKey];
        });

    // Collapse each errorKey's errors into a flat array
    return [].concat(...errorArrays);
}

/*
 * Tries to get an error message from the error, either by using its notification
 * property or first json error (if any)
 * @param  {Error} error A Javascript error
 * @return {string}      Error message string
 */
export function getErrorNotificationMessage(error) {
    return (error && error.notification) || getJsonErrorsAsArray(error)[0] || '';
}
